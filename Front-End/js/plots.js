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
                <div class="mb-3 d-none">
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
            if (students.parent().hasClass("d-none")) {
                students.parent().removeClass("d-none");
            }
            students.html(`<option value=""></option>`);
            const option = $(this).find("option:selected");
            if (option.val() != "") {
                students.append($(
                    `<option class="all-students" value="0">Todos</option>`
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
    const plot = $(`<div id="plot-1"></div>`);
    plots.append(plot);
    const totalInteractions = sessionStorage.getItem("num_interactions");
    const byCompetencies = response.data;
    const max = response.max_num_competencies;
    const keys = Object.keys(byCompetencies);

    const config = {
        responsive: true,
        displayModeBar: false,
        scrollZoom: true
    };

    const layout = {
        title: "Desempenho do aluno por competência",
        barmode: "group",
        width: plots.width(),
        font: {
            size: 12
        },
        xaxis: {
            tickangle: 20
        },
        yaxis: {
            tickformat: "2%"
        }
    };

    const data = [];
    const colors = [
        'rgb(245,232,0)', 
        'rgb(0,244,17)', 
        'rgb(245,1,17)', 
        'rgb(10,11,244)', 
        'rgb(0,245,230)'];
    for (let i = 0; i < max; i++) {
        data[i] = {
            type: "bar",
            marker: {
                color: colors[i]
            },
            font: {
                size: 12
            },
            xaxis: {
                tickangle: 20
            },
            name: `Competência ${i + 1}`,
            hovertemplate:
            `<b>%{customdata}</b>`
        };
        data[i].x = [];
        data[i].customdata = [];
        data[i].y = [];
        for (let j = 0; j < keys.length; j++) {
            if (i >= byCompetencies[keys[j]].length) {
                data[i].x.push("");
                data[i].customdata.push("");
                data[i].y.push(0);
            }
            else {
                data[i].x.push(keys[j]);
                data[i].customdata.push(byCompetencies[keys[j]][i][0]);
                data[i].y.push((Math.random() * 30) / totalInteractions);
                // data[i].y.push(byCompetencies[keys[j]][i][1]);
            }
        }
    }

    Plotly.newPlot(`plot-1`, data, layout);
}