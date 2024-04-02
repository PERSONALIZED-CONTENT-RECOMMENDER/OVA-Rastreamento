import { registerInteraction } from "./request.js";

$(document).ready(function() {
    const logged = JSON.parse(localStorage.getItem("logged"));
    if (logged == null | logged == false) {
        window.location.href = "login.html";
    }
    
    let scrollPoints = {
        20: false,
        40: false,
        60: false,
        80: false,
        100: false
    };

    const dropdown = $(".dropdown");
    dropdown.css({"top": "-450px"});
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

    $(window).on("scroll", function () {
        const s = $(window).scrollTop(),
        d = $(document).height(),
        c = $(window).height();
        const scrollPercent = (s / (d - c)) * 100;
        const position = scrollPercent;

        const pointKeys = Object.keys(scrollPoints);
        pointKeys.forEach(async function(point) {
            if (scrollPercent >= point & scrollPoints[point] === false) {
                scrollPoints[point] = true;
                const action = `This student reached ${point}% in this OVA`;
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
                top: "-450px"
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
            console.log(checked);
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
            .then(response => console.log(response.message))
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
        .then(response => console.log(response.message))
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