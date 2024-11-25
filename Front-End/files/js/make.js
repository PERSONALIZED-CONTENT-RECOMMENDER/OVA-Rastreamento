import { answerQuestion, registerInteraction } from "./request.js";

// Request the student's OVAs and render the items grouped by subject
export function makeCourseOVAs(response, ovaDiv) {
    for (let key in response) {
        const subject = response[key]; // Get the subject
        // Create the HTML dynamically for the subject div
        const subjectDiv = $(`
            <div class="py-3 border-top">
                <h2 id="${subject.subject_id}" class="subject text-center">${key}</h2>
                <ul class="list-group list-group-horizontal-md d-flex flex-wrap w-100 ova-list p-3"></ul>
            </div>
        `);
        // Call the function to render the OVAs of each subject
        makeOVAItems(subject, subjectDiv.find(".ova-list"));
        ovaDiv.append(subjectDiv); // Append the subject div to the OVA div
    }
}

// Dynamically create the HTML for each OVA and append to the course div
function makeOVAItems(response, ovaList) {
    const ovas = response.ovas; // Get the list of OVAs
    ovaList.html(""); // Clear existing list
    for (let i = 0; i < ovas.length; i++) {
        const ova = ovas[i]; // Get the current OVA
        const listItem = $(`
        <li class="ova-item list-group-item d-flex flex-column justify-content-between align-items-center rounded-3 shadow m-2">
            <a class="align-self-start" href="./iframe.html">
                <p><span class="fw-bold">Nome:</span> ${ova.ova_name}</p> <!-- Display OVA name -->
            </a>
        </li>
        `);
        listItem.on("click", function() {
            // Store the ID and the link of the clicked OVA
            localStorage.setItem("ova_id", ova.ova_id); // Store OVA ID
            localStorage.setItem("ova_link", `${ova.link}`); // Store OVA link
            window.location.href = "iframe.html"; // Redirect to iframe page
            localStorage.setItem("subject_id", response.subject_id); // Store subject ID
        });
        ovaList.append(listItem); // Append the list item to the OVA list
    }
}

// Create the options for the course select
export function makeCourseOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["course_id"]}">${data[i]["course_name"]}</option>
        `);
        select.append(option);
    }
}

// Create the options for the student select
export function makeStudentOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["student_id"]}">${data[i]["student_name"]}</option>
        `);
        select.append(option);
        option.insertBefore(select.find(".all-students"));
    }
}

// Create the options for the OVA select
export function makeOVAsOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["ova_id"]}">${data[i]["ova_name"]}</option>
        `);
        select.append(option);
    }
}

// Create the options for the subjects select
export function makeSubjectsOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["subject_id"]}">${data[i]["subject_name"]}</option>
        `);
        select.append(option);
    }
}

// Creates the HTML for the questions
export function makeQuestions(response) {
    const questions = $(".questions");
    questions.html("");
    for (let i = 0; i < response.length; i++) {
        const question = response[i];
        const item = $(`
        <div class="question mb-5" data-number="${i + 1}" data-correct="${question.answer}" data-id="${question.question_id}" data-answered="${question.answered}" data-competency-id="${question.competency_id}">
            <h3>${i + 1}. ${question.statement}</h3>
            <form action="#">
                <div class="alternatives my-3"></div>
                <div class="btn btn-primary w-100 verify-question">Verify</div>
                <p class="message w-100 text-center mt-2 rounded"></p>
            </form>
        </div>
        `);
        makeQuestionAlternatives(item.find(".alternatives"), question.alternatives, i + 1);
        setListener(item);
        questions.append(item);
    }
}

// Creates the HTML for each alternative of each question
export function makeQuestionAlternatives(list, alternatives, number) {
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
When students select an option in each alternative, the API registers
the interaction and whether they selected the correct answer or not.
*/
export function setListener(question) {
    const alternatives = question.find(".alternatives").children();
    const message = question.find(".message");
    alternatives.on("click", function() {
        alternatives.find("input").prop("checked", false);
        $(this).find("input").prop("checked", true);
    });
    const verifyQuestion = question.find(".verify-question");
    verifyQuestion.on("click", async function(e) {
        e.preventDefault();
        const checked = question.find(".alternatives").find("input:checked");
        let action = `The user x clicked the button for question ${question.data("number")}`;
        const isCorrect = checked.val() == question.data("correct");
        if (isCorrect) {
            message.addClass("bg-success");
            message.removeClass("bg-danger");
            message.html("Correct!");

            const answer_data = {
                student_id: localStorage.getItem("student_id"),
                question_id: question.data("id"),
                is_correct: isCorrect
            };
            if (!question.data("answered")) answerQuestion(answer_data);
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

// Create the options for the competency select
/*
export function makeCompetenciesOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["competency_id"]}">${data[i]["competency_description"]}</option>
        `);
        select.append(option);
    }
}
*/