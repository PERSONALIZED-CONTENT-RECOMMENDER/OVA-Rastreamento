const PORT = 8000;
const HOST = "localhost";
const BASE_URL = `http://${HOST}:${PORT}`

export function registerInteraction(interaction) {
    const url = "/interaction/register";
    const data = {
        student_id: localStorage.getItem("student_id"),
        ova_id: localStorage.getItem("ova_id"),
        action: interaction
    }
    return doRequest(url, data);
}

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

export function makeCourseOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["course_id"]}">${data[i]["course_name"]}</option>
        `);
        select.append(option);
    }
}

export function makeStudentOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["student_id"]}">${data[i]["student_name"]}</option>
        `);
        select.append(option);
        option.insertBefore(select.find(".all-students"));
    }
}

export function getCourses() {
    const url = "/courses";
    return doRequest(url, {}, "GET");
}