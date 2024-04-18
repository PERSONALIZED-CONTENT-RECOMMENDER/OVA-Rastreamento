import { doRequest, makeCourseOptions, makeStudentOptions, getCourses } from "./request.js";

$(document).ready(function () {
    sessionStorage.setItem("past_page", "plot");
    const backButton = $(".back-button");
    const plots = $(".plots");

    const is_admin = JSON.parse(localStorage.getItem("is_admin"));
    let backButtonLink;

    if (is_admin == true) backButtonLink = "login.html";
    else {
        const ova_id = localStorage.getItem("ova_id");
        if (ova_id == null) backButtonLink = "login.html";
        else backButtonLink = `./ovas/${localStorage.getItem("ova_link")}`;
    }
    backButton.attr("href", backButtonLink);

    if (is_admin == true) {
        const adminOptions = $(`
            <div class="mt-5">
                <div class="mb-3">
                    <label for="courses">Curso:</label>
                    <select name="" id="courses" class="form-select">
                        <option value=""></option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="students">Estudante:</label>
                    <select name="" id="students" class="form-select">
                        <option value=""></option>
                    </select>
                </div>
            </div>
        `);

        const courses = adminOptions.find("#courses");
        const students = adminOptions.find("#students");

        getCourses()
        .then(response => makeCourseOptions(response, courses))
        .catch(error => console.log(error));

        courses.on("change", async function() {
            students.html(`<option value=""></option>`);
            const option = $(this).find("option:selected");
            if (option.val() != "") {
                students.append($(
                    `<option class="all-students" value="0">All students</option>`
                ));
                await getStudentsByCourse(option.val())
                .then(response => makeStudentOptions(response, students))
                .catch(error => console.log(error));
            }
        });

        students.on("change", function() {
            const option = $(this).find("option:selected");
            if (option.val() != "") {
                const student_data = {
                    "student_id": option.val(),
                    "course_id": courses.find("option:checked").val()
                }
                getStudentPlot(student_data)
                .then(response => makePlot(response, plots))
                .catch(error => console.log(error));
            }
        });

        adminOptions.insertBefore(plots);
    } else {
        const student_data = {
            "student_id": localStorage.getItem("student_id"),
            "course_id": localStorage.getItem("course_id")
        }
        getStudentPlot(student_data)
        .then(response => makePlot(response, plots))
        .catch(error => console.log(error));
    }
});

function getStudentPlot(data) {
    const url = `/plot/student`;
    return doRequest(url, data, "POST");
}

function getStudentsByCourse(course_id) {
    const url = `/student/course/${course_id}`;
    return doRequest(url, {}, "GET");
}

function makePlot(response, plots) {
    console.log(response);
    const base_layout = {
        width: plots.width(),
        font: {
            size: 12
        },
        xaxis: {
            tickangle: 20
        }
    };
    const config = {
        responsive: true,
        displayModeBar: false,
        scrollZoom: true
    };

    const totalInteractions = sessionStorage.getItem("num_interactions");
    for (let i = 0; i < response.length; i++) {
        const plotDiv = $(`<div id="plot-${i}"></div>`);
        plots.append(plotDiv);

        const plot = response[i];
        const plot_data = plot.data
        const plot_type = plot.type

        const subjects = Object.keys(plot_data);
        const percentages = [];
        const num_interactions = Object.values(plot_data);
        num_interactions.forEach(value => {
            percentages.push(value / totalInteractions);
        });

        const data = [
            {
                x: subjects,
                y: percentages,
                type: plot_type,
                text: num_interactions.map(formatGraphLabels),
                textfont: {size: 14}
            }
        ];

        const layout = base_layout;
        layout.title = {text: plot.title};
        layout.yaxis = {tickformat: "2%"};

        Plotly.newPlot(`plot-${i}`, data, layout, config);
    }
}

function formatGraphLabels(num) {
    const totalInteractions = sessionStorage.getItem("num_interactions");
    return `${num}/${totalInteractions}`;
}