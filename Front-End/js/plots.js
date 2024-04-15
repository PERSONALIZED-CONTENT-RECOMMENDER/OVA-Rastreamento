import { doRequest, makeCourseOptions, makeStudentOptions, getCourses } from "./request.js";

$(document).ready(function () {
    const backButton = $(".back-button");
    const plots = $(".plots");

    backButton.attr("href", localStorage.getItem("ova_link"));

    const is_admin = localStorage.getItem("is_admin");
    if (JSON.parse(is_admin) == true) {
        const adminOptions = $(`
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

    // update.on("click", async function(e) {
    //     e.preventDefault();
    //     getData()
    //     .then(response => {
    //         
    //     })
    //     .catch(error => console.log(error));
    // });
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
    const base_layout = {
        width: plots.width(),
        font: {
            size: 10
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
    for (let i = 0; i < response.length; i++) {
        const plotDiv = $(`<div id="plot-${i}"></div>`);
        plots.append(plotDiv);

        const plot = response[i];
        const plot_data = plot.data
        const plot_type = plot.type

        const data = [
            {
                x: Object.keys(plot_data),
                y: Object.values(plot_data),
                type: plot_type
            }
        ];

        const layout = base_layout;
        layout.title = {
            text: plot.title
        }

        Plotly.newPlot(`plot-${i}`, data, layout, config);
    }
}