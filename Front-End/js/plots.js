import { doRequest } from "./request.js";

$(document).ready(function () {
    const plots = $(".plots");
    const update = $(".update");
    const backButton = $(".back-button");
    const courses = $("#courses");
    const students = $("#students");

    backButton.attr("href", localStorage.getItem("ova_link"));
    getCourses()
    .then(response => makeCourseOptions(response, courses))
    .catch(error => console.log(error));
    courses.on("change", function() {
        students.html(`<option value=""></option>`);
        const option = $(this).find("option:selected");
        if (option.val() != "") {
            getStudentsByCourse(option.val())
            .then(response => makeStudentOptions(response, students))
            .catch(error => console.log(error));
        }
    });
    students.on("change", function() {
        const option = $(this).find("option:selected");
        if (option.val() != "") {
            getStudentPlot(option.val())
            .then(response => console.log(response))
            .catch(error => console.log(error));
        }
    });

    // update.on("click", async function(e) {
    //     e.preventDefault();
    //     getData()
    //     .then(response => {
    //         
    //     })
    //     .catch(error => console.log(error));
    // });
});

function getStudentPlot(ra) {
    const url = `/plot/student/${ra}`;
    return doRequest(url, {}, "GET");
}

function getCourses() {
    const url = "/courses";
    return doRequest(url, {}, "GET");
}

function getStudentsByCourse(course_id) {
    const url = `/student/course/${course_id}`;
    return doRequest(url, {}, "GET");
}

function makeCourseOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["course_id"]}">${data[i]["course_name"]}</option>
        `);
        select.append(option);
    }
}

function makeStudentOptions(data, select) {
    for (let i = 0; i < data.length; i++) {
        const option = $(`
            <option value="${data[i]["ra"]}">${data[i]["student_name"]}</option>
        `);
        select.append(option);
    }
}

function makePlot(data) {
    const layout = {

    };
    for (let i = 0; i < response.length; i++) {
        const plot = $(`<div id="plot-${i}"></div>`);
        plot.addClass("overflow-x-scroll")
        plots.append(plot);
        const plot_data = response[i].data
        const plot_type = response[i].type
        const data = [
            {
                x: Object.keys(plot_data),
                y: Object.values(plot_data),
                type: plot_type
            }
        ];
        Plotly.newPlot(`plot-${i}`, data);
    }
}