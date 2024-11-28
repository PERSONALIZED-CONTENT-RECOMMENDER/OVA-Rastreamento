// Base parameters to make the API request
const PORT = 5000;
const HOST = "18.117.233.222";
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
export function getCourseOVAs(course_id) {
    return doRequest(`/ova/course/${course_id}`, {}, "GET"); // Send request to get OVAs
}

/* 
Calls the request function with the parameters to get all the questions 
of an OVA
*/
export function getOVAQuestions() {
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
export function getSubjectOVAs(subject_id) {
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

// Calls the request function with the parameters to get all the competencies
/*
export function getAllCompetencies() {
    const url = "/competency";
    return doRequest(url, {}, "GET");
}
*/
