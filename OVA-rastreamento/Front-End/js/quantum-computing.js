import { doRequest } from "./request.js";

$(document).ready(function() {
    const dropdown = $(".dropdown");
    dropdown.css({"top": "-450px"});
    const dropdownButton = $(".dropdown-button");
    const carrousels = $("section").find(".carrousel");
    const questions = $(".question");
    const sendText = $(".questions").find(".send-text");

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
        carrousel.find(".arrow-left").on("click", async function() {
            changePart(-1, carrousel, carrouselsActualParts);
            let carrousel_data = {
                carrousel_name: carrousel.data("carrousel-name"),
                message: `The user x passed the image in the carrousel of ${carrousel.data("carrousel-name")}`
            };
            await registerAction(carrousel_data)
            .then(response => console.log("success"))
            .catch(error => console.log(error));
        });
        carrousel.find(".arrow-right").on("click", async function() {
            changePart(1, carrousel, carrouselsActualParts);
            let carrousel_data = {
                carrousel_name: carrousel.data("carrousel-name"),
                message: `The user x passed the image in the carrousel of ${carrousel.data("carrousel-name")}`
            };
            await registerAction(carrousel_data)
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
            let question_data = {
                question: question.find("h3").html(),
                question_number: question.data("number"),
                selected: checked.val(),
                answer: question.data("correct"),
                message: `The user x clicked the button of the question ${question.data("number")}`
            };
            if (checked.val() == question.data("correct")) {
                message.addClass("bg-success");
                message.removeClass("bg-danger");
                message.html("Correct!");
            } else {
                message.addClass("bg-danger");
                message.removeClass("bg-success");
                message.html("Incorrect.");
            }
            await registerAction(question_data)
            .then(response => console.log(response.message))
            .catch(error => console.log(error));
        });
    });

    sendText.on("click", async function(e) {
        e.preventDefault();
        const question = questions.find("[data-number='3']");
        let text_data = {
            question_number: questions.find,
            question: question.find("h3").html(),
            text: questions.find(".q3-answer").val()
        };
        await registerAction(text_data)
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

function registerAction(data) {
    const url = "http://localhost:8000/interaction/register";
    return doRequest(url, data);
}