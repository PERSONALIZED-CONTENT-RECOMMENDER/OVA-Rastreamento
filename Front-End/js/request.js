// Base parameters to make the API request
const PORT = 8090;
const HOST = "localhost";
const BASE_URL = `http://${HOST}:${PORT}`;

// Send the request to the API using a Promise, due to the async functionality
export function doRequest(url, data, type="POST", is_login=0) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: type,
            url: BASE_URL + url,
            data: JSON.stringify([data]),
            dataType: "json",
            crossDomain: true,
            contentType: "application/json",
            headers: {
                "Access-Control-Allow-Origin": "http:"
            },
            success: (response) => resolve(response),
            error: (response) => reject(response)
        });
    });
}

// Base function to register any interaction in the OVA
export function registerInteraction(interaction) {
    const url = "/interaction/register";
    const data = {
        student_id: localStorage.getItem("student_id"),
        ova_id: localStorage.getItem("ova_id"),
        // competency_id: localStorage.getItem("competency_id"),
        action: interaction
    }
    return doRequest(url, data);
}

// Calls the request function with the parameters for login
export function login(user_data) {
    const url = "/login"; // Define the login URL
    return doRequest(url, user_data, "POST", true); // Send the login request
}

// Calls the request function with the parameters to get the OVAs of a course
export function getOVAs(course_id) {
    return doRequest(`/ova/course/${course_id}`, {}, "GET"); // Send request to get OVAs
}

/* 
Calls the request function with the parameters to get all the questions 
of an OVA
*/
export function getQuestions() {
    const data = {
        ova_id: localStorage.getItem("ova_id"),
        student_id: localStorage.getItem("student_id")
    };
    return doRequest(`/question/ova`, data, 'POST');
}

// Calls the request function with the parameters to get all courses
export function getCourses() {
    const url = "/courses";
    return doRequest(url, {}, "GET");
}

// Calls the request function with the parameters to get all the OVAs
export function getCourseOVAs(subject_id) {
    const url = `/ova/subject/${subject_id}`;
    return doRequest(url, {}, "GET");
}

// Calls the request function with the parameters to get all the course subjects
export function getCourseSubjects(course_id) {
    const url = `/course/${course_id}/subjects`;
    return doRequest(url, {}, "GET");
}

// Calls the request function with the parameters to get the student plot
export function getStudentPlot(data) {
    const url = `/plot/student`; // Defining the endpoint URL for student plot.
    return doRequest(url, data, "POST"); // Making a POST request to retrieve the student plot data.
}

// Calls the request function with the parameters to get the course plot
export function getCoursePlot(data) {
    const url = "/plot/course"; // Defining the endpoint URL for course plot.
    return doRequest(url, data, "POST"); // Making a POST request to retrieve the course plot data.
}

// Calls the request function with the parameters to get the OVA plot
export function getOVAPlot(data) {
    const url = "/plot/ova"; // Defining the endpoint URL for OVA plot.
    return doRequest(url, data, "POST"); // Making a POST request to retrieve the OVA plot data.
}

// Calls the request function with the parameters to get the students of a course
export function getStudentsByCourse(course_id) {
    const url = `/student/course/${course_id}`; // Defining the endpoint URL for fetching students of a specific course.
    return doRequest(url, {}, "GET"); // Making a GET request to retrieve the list of students in the course.
}

export function getStudentInteractionsNum(data) {
    const url = "/plot/interaction/ova" // Defining the endpoint URL for fetching student interactions for a specific OVA.
    return doRequest(url, data, "POST") // Making a POST request to retrieve the student interactions data.
}

/*
Calls the request function with the parameters to get all the questions 
of an OVA along with the answers given by the student.
*/
export function answerQuestion(data) {
    return doRequest(`/question/answer`, data, 'POST');
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

// Calls the request function with the parameters to get all the competencies
/*
export function getAllCompetencies() {
    const url = "/competency";
    return doRequest(url, {}, "GET");
}
*/
