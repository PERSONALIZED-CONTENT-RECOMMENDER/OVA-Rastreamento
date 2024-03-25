$(document).ready(function () {
    const headerDropdownButton = $(".header").find(".dropdown-button");
    const dropdown = $(".dropdown");
    const carrousels = $("section").find(".carrousel");
    const questions = $(".questions").children();
    const sendText = $(".questions").find(".send-text");

    dropdown.css({"height": "0px"});
    dropdown.addClass("d-none");

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

    headerDropdownButton.on("click", () => {
        if (headerDropdownButton.hasClass("bi-list")) {
            dropdown.removeClass("d-none");
            headerDropdownButton.removeClass("bi-list");
            headerDropdownButton.addClass("bi-x-lg");
            dropdown.removeClass("opacity-0");
            dropdown.animate({
                opacity: 1,
                height: "30vh"
            }, 300);
        } else {
            headerDropdownButton.removeClass("bi-x-lg");
            headerDropdownButton.addClass("bi-list");
            dropdown.animate({
                opacity: 0,
                height: "0px"
            }, 300);
            setTimeout(function() {
                dropdown.addClass("d-none");
            }, 300);
        }
    });

    carrousels.each(index => {
        const carrousel = carrousels.eq(index);
        carrousel.find(".arrow-left").on("click", function() {
            changePart(-1, carrousel, carrouselsActualParts);
            let carrousel_data = {
                carrousel_name: carrousel.data("carrousel-name"),
                message: `The user x passed the image in the carrousel of ${carrousel.data("carrousel-name")}`
            };
            sendToLog(carrousel_data)
            .then(response => console.log(response.message))
            .catch(error => console.log(error));
        });
        carrousel.find(".arrow-right").on("click", function() {
            changePart(1, carrousel, carrouselsActualParts);
            let carrousel_data = {
                carrousel_name: carrousel.data("carrousel-name"),
                message: `The user x passed the image in the carrousel of ${carrousel.data("carrousel-name")}`
            };
            sendToLog(carrousel_data)
            .then(response => console.log(response.message))
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
        verifyQuestion.on("click", function(e) {
            e.preventDefault();
            const checked = question.find(".options").find("input:checked");
            console.log(checked);
            let question_data = {
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
            sendToLog(question_data)
            .then(response => console.log(response.message))
            .catch(error => console.log(error));
        });
    });
});

function sendToLog(data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/",
            data: JSON.stringify([data]),
            dataType: "json",
            contentType: "application/json",
            success: (response) => resolve(response),
            error: (response) => reject(response)
        });
    });
}

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