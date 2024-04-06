import { registerInteraction } from "./request.js";

function generateScrollPoints(readTime, n_points) {
    let points = [];
    const perc = 100 / n_points;
    const perc_time = readTime / n_points;
    const alreadyScrolled = JSON.parse(localStorage.getItem("perc_scrolled"));
    for (let i = 1; i <= n_points; i++) {
        points.push({
            perc: perc * i,
            time: perc_time * i,
            status: perc * i <= alreadyScrolled
        });
    }

    return points;
}

$(document).ready(function() {
    const read_time = localStorage.getItem("read_time");
    let timePassed;
    if (read_time == null) {
        timePassed = 0;
        localStorage.setItem("read_time", 0);
    } else timePassed = read_time;

    if (localStorage.getItem("perc_scrolled") == null) {
        localStorage.setItem("perc_scrolled", 0);
    }
    setInterval(function() {
        timePassed++;
    }, 1000);

    const logged = JSON.parse(localStorage.getItem("logged"));
    if (logged == null | logged == false) {
        window.location.href = "login.html";
    }
    
    let scrollPoints = generateScrollPoints(360, 5);

    const dropdown = $(".dropdown");
    dropdown.css({"top": "-600px"});
    const dropdownButton = $(".dropdown-button");
    const carrousels = $("section").find(".carrousel");
    const questions = $(".question");
    const sendText = $(".questions").find(".send-text");
    const accordionItems = $(".accordion-item");

    let accordionView = [];

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

        scrollPoints.forEach(async point => {
            if (scrollPercent >= point.perc & point.status === false & timePassed >= point.time) {
                point.status = true;
                localStorage.setItem("perc_scrolled", point.perc);
                localStorage.setItem("read_time", point.time);
                const action = `This student reached ${point.perc}% in this OVA`;
                await registerInteraction(action)
                .then(response => console.log("success"))
                .catch(error => console.log(error));
            }
        });
        
        $("#progressbar").attr('value', position);
    });
    
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

    dropdownButton.on("click", function() {
        if (!dropdownButton.hasClass("bi-x-lg")) {
            dropdown.removeClass("z-n1").addClass("z-1");
            dropdown.animate({
                top: "50px"
            }, 250);
            dropdownButton.addClass("bi-x-lg");
        } else {
            dropdown.animate({
                top: "-600px"
            }, 250);
            dropdownButton.removeClass("bi-x-lg");
        }
    });

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

    questions.each(index => {
        const question = questions.eq(index);
        const options = question.find(".options").children();
        const message = question.find(".message");
        options.on("click", function() {
            options.find("input").prop("checked", false);
            $(this).find("input").prop("checked", true);
        });
        const verifyQuestion = question.find(".verify-question");
        verifyQuestion.on("click", async function(e) {
            e.preventDefault();
            const checked = question.find(".options").find("input:checked");
            let action =`The user x clicked the button of the question ${question.data("number")}`;
            if (checked.val() == question.data("correct")) {
                message.addClass("bg-success");
                message.removeClass("bg-danger");
                message.html("Correct!");
            } else {
                message.addClass("bg-danger");
                message.removeClass("bg-success");
                message.html("Incorrect.");
            }
            await registerInteraction(action)
            .then(response => console.log("success"))
            .catch(error => console.log(error));
        });
    });

    sendText.on("click", async function(e) {
        e.preventDefault();
        const question = questions.find("[data-number='3']");
        const action = "The user submitted the answer of question 3";
        // let text_data = {
        //     ra: localStorage.getItem("ra"),
        //     ova_id: localStorage.getItem("ova_id"),
        //     question_number: questions.find,
        //     question: question.find("h3").html(),
        //     text: questions.find(".q3-answer").val(),
        //     action: "The user submitted the answer of question 3"
        // };
        await registerInteraction(action)
        .then(response => console.log("success"))
        .catch(error => console.log(error));
    });
});

function changePart(side, carrousel, carrouselsActualParts) {
    const parts = carrousel.find(".parts").children();
    let actualPart = carrouselsActualParts[carrousel.data("carrousel-name")];
    actualPart = actualPart + side;
    if (side > 0 & actualPart == parts.length) {
        actualPart = 0;
    } else if (side < 0 & actualPart < 0) {
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