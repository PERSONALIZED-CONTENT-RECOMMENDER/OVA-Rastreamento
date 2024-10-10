import { 
    registerInteraction, 
    getQuestions, 
    makeQuestions
} 
from "./request.js";

// Access the HTML inside the iframe
// const mainIframe = $("#iframe");
// const iframeDoc = mainIframe.contents()[0];
// const contentWindow = mainIframe.get(0).contentWindow;

$(document).ready(function() {
    sessionStorage.setItem("past_page", "iframe");
    /*
    Attempt to retrieve the read time of the OVA. If it's null, it indicates
    that the user just started reading.
    */
    const read_time = localStorage.getItem("read_time");
    let timePassed;
    if (read_time == null) {
        // Initialize the read time counter
        timePassed = 0;
        localStorage.setItem("read_time", 0);
    } else timePassed = read_time;

    // Similarly, attempt to get the percentage of the OVA that has been scrolled
    if (localStorage.getItem("perc_scrolled") == null) {
        localStorage.setItem("perc_scrolled", 0);
    }

    // Update the time passed counter by 1 every second
    setInterval(function () {
        timePassed++;
    }, 1000);

    // Redirect to the login page if the user is not logged in
    const logged = JSON.parse(localStorage.getItem("logged"));
    if (logged == null || logged === false) {
        window.location.href = "login.html";
    }

    /*
    Divide the page scroll into n points (5), and the user needs to 
    pass each point within at least total_time / n_points (360/5) seconds
    */
    let scrollPoints = generateScrollPoints(360, 5);

    const carrousels = $("section").find(".carrousel");
    const accordionItems = $(".accordion-item");

    getQuestions()
    .then(response => {
        makeQuestions(response);

        let total_interactions = 0;

        carrousels.each(index => {
            const carrousel = carrousels.eq(index);
            const parts = carrousel.find(".parts").children();
            total_interactions += parts.length;
        });
        total_interactions += accordionItems.length;
        total_interactions += scrollPoints.length;
        total_interactions += $(".ova_video").length;
        total_interactions += response.length;
        
        sessionStorage.setItem("total_interactions", total_interactions);
    })
    .catch(error => console.log(error));
    

    // This section counts the total number of interactions in the OVA

    let accordionView = [];

    /*
    For each accordion item, if the student opens the item, 
    it registers an interaction, sending to the API the description, 
    along with the name of the item and the section it belongs to
    */
    accordionItems.each(index => {
        const accordionItem = accordionItems.eq(index);
        accordionView.push(false);
        accordionItem.find(".accordion-header").on("click", function(e) {
            e.preventDefault();
            if (accordionItem.find(".accordion-button").hasClass("collapsed")) {
                accordionItems.find(".accordion-button").addClass("collapsed");
                accordionItems.find(".accordion-collapse").removeClass("show");
                accordionItem.find(".accordion-button").removeClass("collapsed");
                accordionItem.find(".accordion-collapse").addClass("show");
                if (!accordionView[index]) {
                    const itemName = accordionItem.find(".accordion-button").html();
                    const action = `The user read the ${itemName} accordion`;
                    registerInteraction(action)
                    .then(response => console.log("success"))
                    .catch(error => console.log(error));
                }
            } else {
                accordionItem.find(".accordion-button").addClass("collapsed");
                accordionItem.find(".accordion-collapse").removeClass("show");
            }
        });
    });

    /*
    Animation to display the section content to the user only when 
    they reach that point
    */
    const sections = $(".section-content");
    $(window).on("scroll", function () {
        const s = $(window).scrollTop(),
            d = $(document).height(),
            c = $(window).height();
            
        $.each(sections, function(index) {
            const section = sections.eq(index);
            if (s - section.parent().offset().top >= - c / 2) {
                section.animate({
                    left: "0px",
                    opacity: 1 
                }, 500);
            }
        });

        const scrollPercent = (s / (d - c)) * 100;
        const position = scrollPercent;

        /**
        When the student reaches a new scroll point, the API registers 
        that the student reached that point. Additionally, the maximum 
        percentage scrolled is updated in local storage.
        */
        scrollPoints.forEach(async point => {
            if (scrollPercent >= point.perc && point.status === false && timePassed >= point.time) {
                point.status = true;
                localStorage.setItem("perc_scrolled", point.perc);
                localStorage.setItem("read_time", point.time);
                const action = `This student reached ${point.perc}% in this OVA`;
                await registerInteraction(action)
                .then(response => console.log("success"))
                .catch(error => console.log(error));
            }
        });
    });
    
    // Displays the first carrousel item in each carrousel
    let carrouselsActualParts = {};
    carrousels.each(index => {
        const carrousel = carrousels.eq(index);
        const parts = carrousel.find(".parts").children();
        parts.each(index => {
            const part = parts.eq(index);
            if (index == 0) part.show();
            else part.hide();
        });
        carrouselsActualParts[carrousel.data("carrousel-name")] = 0;
    });

    /*
    When the student navigates through the carrousel items, the API 
    registers that the student made an interaction with that specific carrousel
    */
    carrousels.each(index => {
        const carrousel = carrousels.eq(index);
        let action = `The user x passed the image in the carrousel of ${carrousel.data("carrousel-name")}`;
        carrousel.find(".arrow-left").on("click", async function() {
            changePart(-1, carrousel, carrouselsActualParts);
            await registerInteraction(action)
            .then(response => console.log("success"))
            .catch(error => console.log(error));
        });
        carrousel.find(".arrow-right").on("click", async function() {
            changePart(1, carrousel, carrouselsActualParts);
            await registerInteraction(action)
            .then(response => console.log("success"))
            .catch(error => console.log(error));
        });
    });
});

/*
The function to generate the scroll points, given a minimum read time
and the number of points.
*/
function generateScrollPoints(readTime, n_points) {
    let points = [];
    const perc = 100 / n_points;
    const perc_time = readTime / n_points;
    const alreadyScrolled = JSON.parse(localStorage.getItem("perc_scrolled"));
    for (let i = 1; i <= n_points; i++) {
        /*
        The percentage of the point, the minimum time, and 
        whether the student has already achieved that point.
        */
        points.push({
            perc: perc * i,
            time: perc_time * i,
            status: perc * i <= alreadyScrolled
        });
    }

    return points;
}

// Function to change the item of the carousels
function changePart(side, carrousel, carrouselsActualParts) {
    const parts = carrousel.find(".parts").children();
    let actualPart = carrouselsActualParts[carrousel.data("carrousel-name")];
    actualPart = actualPart + side;
    if (side > 0 && actualPart == parts.length) {
        actualPart = 0;
    } else if (side < 0 && actualPart < 0) {
        actualPart = parts.length - 1;
    }

    carrouselsActualParts[carrousel.data("carrousel-name")] = actualPart;
    parts.each(index => {
        const part = parts.eq(index);
        if (index == actualPart) part.show();
        else part.hide();
    });
    changeDots(carrousel, actualPart);
}

// Function to change the dot of the current item of the carousel
function changeDots(carrousel, part) {
    const dots = carrousel.find(".dots").children();
    dots.each(index => {
        const dot = dots.eq(index);
        if (index == part) {
            dot.addClass("bi-circle-fill");
            dot.removeClass("bi-circle");
            dot.addClass("fs-5");
        } else {
            dot.removeClass("bi-circle-fill");
            dot.addClass("bi-circle");
            dot.removeClass("fs-5");
        }
    });
}