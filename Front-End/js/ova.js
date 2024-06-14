import { doRequest, registerInteraction } from "./request.js";

// access the html inside the iframe
// const mainIframe = $("#iframe");
// const iframeDoc = mainIframe.contents()[0];
// const contentWindow = mainIframe.get(0).contentWindow;

$(document).ready(function() {
    sessionStorage.setItem("past_page", "ova");
    /*
    try to get the read time of the ova. If its null, the user just started
    the reading
    */
    const read_time = localStorage.getItem("read_time");
    let timePassed;
    if (read_time == null) {
        // initializes the read time count
        timePassed = 0;
        localStorage.setItem("read_time", 0);
    } else timePassed = read_time;

    // tries the same with the percentual of the ova that was scrolled
    if (localStorage.getItem("perc_scrolled") == null) {
        localStorage.setItem("perc_scrolled", 0);
    }

    // update the time passed counter by 1 every second
    setInterval(function() {
        timePassed++;
    }, 1000);

    // if the user isn't logged, go to login page
    const logged = JSON.parse(localStorage.getItem("logged"));
    if (logged == null | logged == false) {
        window.location.href = "login.html";
    }

    getQuestions(localStorage.getItem("ova_id"))
    .then(response => makeQuestions(response))
    .catch(error => error);
    
    /*
    divides the page scroll in n points (5) and the user needs
    to pass by it in at least total_time / n_points (360/5) seconds
    */
    let scrollPoints = generateScrollPoints(360, 5);

    // get the DOM elements
    const dropdown = $(".dropdown");
    dropdown.css({"top": "-600px"});
    const dropdownButton = $(".dropdown-button");
    const carrousels = $("section").find(".carrousel");
    const questions = $(".question");
    const sendText = $(".questions").find(".send-text");
    const accordionItems = $(".accordion-item");

    // this lines counts the total number of interactions in the ova
    let num_interactions = 0;
    carrousels.each(index => {
        const carrousel = carrousels.eq(index);
        const parts = carrousel.find(".parts").children();
        num_interactions += parts.length;
    })
    num_interactions += accordionItems.length;
    num_interactions += questions.length;
    num_interactions += scrollPoints.length;
    num_interactions += sendText.length;
    num_interactions += $(".ova_video").length * 5;
    sessionStorage.setItem("num_interactions", num_interactions);

    let accordionView = [];

    /*
    for each accordion item, if the student open the item, it register an
    interaction, sendind to the api the description, with the name of the
    item and the section it belongs to
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
    animation to show the section content to the user only when he reached
    that point
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
        when the student reaches a new scroll points, the API register that 
        the student reached that point. Also the maximum percentage scrolled
        is updated in the localstorage
         */
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
        
        // update the progress bar
        $("#progressbar").attr('value', position);
    });
    
    // shows the first carrousel item in each carrousel
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
    when the dropdown button is clicked, shows all the sections, the button
    to logout and the button to the student plot page
    */
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

    /*
    when the student passes the carrousel itens, the API register that the
    student made an interaction with that specific carrousel
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

    // register the answer that the student wrote in the question
    sendText.on("click", async function(e) {
        e.preventDefault();
        const question = questions.find("[data-number='3']");
        const action = "The user submitted the answer of question 3";
        await registerInteraction(action)
        .then(response => console.log("success"))
        .catch(error => console.log(error));
    });
});

/*
the function to generate the scrollpoints, given a minimum read time
and the number of the points
*/
function generateScrollPoints(readTime, n_points) {
    let points = [];
    const perc = 100 / n_points;
    const perc_time = readTime / n_points;
    const alreadyScrolled = JSON.parse(localStorage.getItem("perc_scrolled"));
    for (let i = 1; i <= n_points; i++) {
        /*
        the percentage of the point, the minimum time and 
        if the student already achieved that point
        */
        points.push({
            perc: perc * i,
            time: perc_time * i,
            status: perc * i <= alreadyScrolled
        });
    }

    return points;
}

// function to change the item of the carrousels
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

// function to change the dot of the actual item of the carrousel
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

function getQuestions(ova_id) {
    return doRequest(`/question/ova/${ova_id}`, {}, 'GET');
}

function makeQuestions(response) {
    const questions = $(".questions");
    questions.html("");
    for (let i = 0; i < response.length; i++) {
        const question = response[i];
        const item = $(`
        <div class="question mb-5" data-number="${i + 1}" data-correct="${question.answer}">
            <h3>${i + 1}. ${question.statement}</h3>
            <form action="#">
                <div class="alternatives my-3"></div>
                <div class="btn btn-primary w-100 verify-question">Verificar</div>
                <p class="message w-100 text-center mt-2 rounded"></p>
            </form>
        </div>
        `);
        makeQuestionAlternatives(item.find(".alternatives"), question.alternatives, i + 1);
        setListener(item);
        questions.append(item);
    }
}

function makeQuestionAlternatives(list, alternatives, number) {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < alternatives.length; i++) {
        const alternative = alternatives[i];
        const item = $(`
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${letters[i]}" id="${number}${letters[i]}">
            <label class="form-check-label" for="${number}${letters[i]}">${alternative}</label>
        </div>    
        `);
        list.append(item);
    }
}

/*
when the students mark the option in each alternatives, the API register
the interaction and if he marked the correct answer or not
*/
function setListener(question) {
    const alternatives = question.find(".alternatives").children();
    const message = question.find(".message");
    alternatives.on("click", function() {
        alternatives.find("input").prop("checked", false);
        $(this).find("input").prop("checked", true);
        console.log($(this).find("input").val() == question.data("correct"))
    });
    const verifyQuestion = question.find(".verify-question");
    verifyQuestion.on("click", async function(e) {
        e.preventDefault();
        const checked = question.find(".alternatives").find("input:checked");
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
}

/*
<div class="question mb-5" data-number="1" data-correct="d">
                    
                    <form action="#">
                        <div class="options my-3">
                            
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="b" id="1b">
                                <label class="form-check-label" for="1b">Refrigeração</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="c" id="1c">
                                <label class="form-check-label" for="1c">Decoerência</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="d" id="1d">
                                <label class="form-check-label" for="1d">Falta de mão de obra qualificada</label>
                            </div>
                        </div>
                        <div class="btn btn-primary w-100 verify-question">Verificar</div>
                    </form>
                </div>
*/