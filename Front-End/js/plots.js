import { doRequest, makeCourseOptions, makeStudentOptions, getCourses, getAllOVAs, makeOVAsOptions } from "./request.js";

$(document).ready(function () {
    sessionStorage.setItem("past_page", "plot");
    const backButton = $(".back-button");
    const plots = $(".plots");

    // verify if the user is admin or not
    const is_admin = JSON.parse(localStorage.getItem("is_admin"));
    let backButtonLink;
    
    // if admin, the back button goes back to login html
    if (is_admin == true) backButtonLink = "login.html";
    else {
        // else the back button goes back to the ova that the student was reading
        const ova_id = localStorage.getItem("ova_id");
        if (ova_id == null) backButtonLink = "login.html";
        else backButtonLink = `./ovas/${localStorage.getItem("ova_link")}`;
    }
    backButton.attr("href", backButtonLink);

    /*
    if admin, show admin options at the plot page, and let the coordinator
    see information about all the courses and all the students
    */
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
                <div class="mb-3 d-none">
                    <label for="ovas">OVA:</label>
                    <select name="" id="ovas" class="form-select">
                        <option value=""></option>
                    </select>
                </div>
            </div>
        `);

        const courses = adminOptions.find("#courses");
        const students = adminOptions.find("#students");
        const ovas = adminOptions.find("#ovas");

        // send a request to the API to get all the courses
        getCourses()
        .then(response => makeCourseOptions(response, courses))
        .catch(error => console.log(error));

        // send a request to the API to get all the ovas
        getAllOVAs()
        .then(response => makeOVAsOptions(response, ovas))
        .catch(error => console.log(error));

        /*
        if the admin change the course select, updates the student
        select and the course plot
        */
        courses.on("change", function() {
            if (students.parent().hasClass("d-none")) {
                students.parent().removeClass("d-none");
                ovas.parent().removeClass("d-none");
            }
            students.html(`<option value=""></option>`);
            const option = $(this).find("option:selected");
            if (option.val() != "") {
                students.append($(
                    `<option class="all-students" value="0">Todos</option>`
                ));
                getStudentsByCourse(option.val())
                .then(response => makeStudentOptions(response, students))
                .catch(error => console.log(error));

                getCoursePlot({"course_id": option.val()})
                .then(response => courseGeneralPerformance(response, plots))
                .catch(error => console.log(error));
            }
        });

        /*
        if the student select change, update the student plot
        */
        students.on("change", function() {
            const option = $(this).find("option:selected");
            if (option.val() != "") {
                const student_data = {
                    "student_id": option.val(),
                    "course_id": courses.find("option:checked").val()
                }
                getStudentPlot(student_data)
                .then(response => studentCompetencyPerformance(response, plots))
                .catch(error => console.log(error));
            }
        });

        // if the ova select change, also changes the ova plot
        ovas.on("change", function() {
            const option = $(this).find("option:selected");
            if (option.val() != "") {
                const ova_data = {
                    "ova_id": option.val(),
                    "course_id": courses.find("option:checked").val()
                }
                getOVAPlot(ova_data)
                .then(response => ovaGeneralPerformance(response, plots))
                .catch(error => console.log(error));
            }
        });

        adminOptions.insertBefore(plots);
    } else {
        // if not admin, the student only sees his performance
        const student_data = {
            "student_id": localStorage.getItem("student_id"),
            "course_id": localStorage.getItem("course_id")
        }
        getStudentPlot(student_data)
        .then(response => studentCompetencyPerformance(response, plots))
        .catch(error => console.log(error));
    }
});

// calls the request function with the parameters for get the student plot
function getStudentPlot(data) {
    const url = `/plot/student`;
    return doRequest(url, data, "POST");
}

// calls the request function with the parameters for get the course plot
function getCoursePlot(data) {
    const url = "/plot/course";
    return doRequest(url, data, "POST");
}

// calls the request function with the parameters for get the ova plot
function getOVAPlot(data) {
    const url = "/plot/ova";
    return doRequest(url, data, "POST");
}

// // calls the request function with the parameters for get the students of a course
function getStudentsByCourse(course_id) {
    const url = `/student/course/${course_id}`;
    return doRequest(url, {}, "GET");
}

// plot the graph of the students of the course performance grouped by competencies
function studentCompetencyPerformance(response, plots) {
    const plot = $(`<div id="plot-1"></div>`);
    plots.append(plot);
    const byCompetencies = response.data;
    const max = response.max_num_competencies;
    const keys = Object.keys(byCompetencies);

    // set the configurations of the plot
    const config = {
        responsive: true,
        displayModeBar: false,
        scrollZoom: true
    };

    // set the plot layout
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

    // set the data for the plot and its plot options
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
                data[i].y.push(byCompetencies[keys[j]][i][1]);
            }
        }
    }

    Plotly.newPlot(`plot-1`, data, layout, config);
}

// plot the graph of the general students performances in the course
function courseGeneralPerformance(response, plots) {
    const plot = $(`<div id="plot-2"></div>`);
    plots.append(plot);

    // set the configurations of the plot
    const config = {
        responsive: true,
        displayModeBar: false,
        scrollZoom: true
    };

    // set the plot layout
    const layout = {
        title: response.title,
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

    // set the data for the plot and its plot options
    const data = [{
        x: response.data.students,
        y: response.data.perc,
        type: response.type,
        font: {
            size: 12
        },
        xaxis: {
            tickangle: 20
        }
    }];

    Plotly.newPlot(`plot-2`, data, layout, config);
    console.log(response);
}

// plot the graph for the performance of an ova with all the students
function ovaGeneralPerformance(response, plots) {
    const plot = $(`<div id="plot-3"></div>`);
    plots.append(plot);

    // set the configurations of the plot
    const config = {
        responsive: true,
        displayModeBar: false,
        scrollZoom: true
    };

    // set the plot layout
    const layout = {
        title: response.title,
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

    // set the data for the plot and its plot options
    const data = [{
        x: response.data.students,
        y: response.data.perc,
        type: response.type,
        font: {
            size: 12
        },
        xaxis: {
            tickangle: 20
        }
    }];

    // set the plot with the properties
    Plotly.newPlot(`plot-3`, data, layout, config);
    console.log(response);
}