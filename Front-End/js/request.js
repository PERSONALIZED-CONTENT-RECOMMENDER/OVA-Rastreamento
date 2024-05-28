// base parameters to make the API request
const PORT = 8000;
const HOST = "localhost";
const BASE_URL = `http://${HOST}:${PORT}`

// base function to register any interaction in the OVA
export function registerInteraction(interaction) {
    const url = "/interaction/register";
    const data = {
        student_id: localStorage.getItem("student_id"),
        ova_id: localStorage.getItem("ova_id"),
        action: interaction
    }
    return doRequest(url, data);
}

// send the request to the API using a Promise, due to the async funcionality
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
                "Access-Control-Allow-Origin":"http:"
            },
            success: (response) => resolve(response),
            error: (response) => reject(response)
        });
    });
}

// make the options for the course select
export function makeCourseOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["course_id"]}">${data[i]["course_name"]}</option>
        `);
        select.append(option);
    }
}

// make the options for the student select
export function makeStudentOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["student_id"]}">${data[i]["student_name"]}</option>
        `);
        select.append(option);
        option.insertBefore(select.find(".all-students"));
    }
}

// make the options for the OVA select
export function makeOVAsOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["ova_id"]}">${data[i]["ova_name"]}</option>
        `);
        select.append(option);
    }
}

// calls the request function with the parameters for get all courses
export function getCourses() {
    const url = "/courses";
    return doRequest(url, {}, "GET");
}

// calls the request function with the parameters for get all the OVAs
export function getAllOVAs() {
    const url = "/ova/all";
    return doRequest(url, {}, "GET");
}