import { doRequest, makeCourseOptions, makeStudentOptions, getCourses, getAllOVAs, makeOVAsOptions } from "./request.js";
//import { doRequest, makeCourseOptions, makeStudentOptions, getCourses, getAllOVAs, makeOVAsOptions, makeCompetenciesOptions, getAllCompetencies } from "./request.js";

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


    const options = $(`
        <div class="options mt-5">
            <div id="choose-ova" class="mb-3">
                <label for="ovas">OVA:</label>
                <select name="" id="ovas" class="form-select">
                    <option value=""></option>
                </select>
            </div>
        </div>
    `);

    const ovas = options.find("#ovas");

    // send a request to the API to get all the ovas
    getAllOVAs()
    .then(response => makeOVAsOptions(response, ovas))
    .catch(error => console.log(error));

    let ovaListener;

    /*
    if admin, show admin options at the plot page, and let the coordinator
    see information about all the courses and all the students
    */
    if (is_admin == true) {
        options.find("#choose-ova").addClass("d-none");

        const adminOptions = $(`
            <div id="choose-course" class="mb-3">
                <label for="courses">Curso:</label>
                <select name="" id="courses" class="form-select">
                    <option value=""></option>
                </select>
            </div>
            <div id="choose-student" class="students-select mb-3 d-none">
                <label for="students">Estudante:</label>
                <select name="" id="students" class="form-select">
                    <option value=""></option>
                </select>
            </div>
        `);
        // <div id="choose-competency" class="mb-3 d-none">
        //     <label for="ovas">Competência:</label>
        //     <select name="" id="competencies" class="form-select">
        //         <option value=""></option>
        //     </select>
        // </div>

        const courses = adminOptions.find("#courses");
        const students = adminOptions.find("#students");
        //const competencies = adminOptions.find("#competencies");

        // send a request to the API to get all the courses
        getCourses()
        .then(response => makeCourseOptions(response, courses))
        .catch(error => console.log(error));

        // send a request to the API to get all the competencies 
        /*
        getAllCompetencies()
        .then(response => makeCompetenciesOptions(response, competencies))
        .catch(error => console.log(error));
        */

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

        ovaListener = (option) => {
            getOVAPlot({
                "ova_id": option.val(),
                "course_id": courses.find("option:checked").val()
            })
            .then(response => ovaGeneralPerformance(response, plots))
            .catch(error => console.log(error));
        };

        // if the competency select change, also changes the ova plot
        /*
        competencies.on("change", function() {
            const option = $(this).find("option:selected");
            if (option.val() != "") {
                const competency_data = {
                    "competency_id": option.val(),
                    "course_id": courses.find("option:checked").val()
                }
                getCompetencyPlot(competency_data)
                .then(response => competencyGeneralPerformance(response, plots))
                .catch(error => console.log(error));
            }
        });
        */

        adminOptions.before(options.find("#choose-ova"));
    } else {
        // if not admin, the student only sees his performance
        const student_data = {
            "student_id": localStorage.getItem("student_id"),
            "course_id": localStorage.getItem("course_id"),
            "subject_id": localStorage.getItem("subject_id"),
            "ova_id": localStorage.getItem("ova_id")
        };

        ovaListener = (option) => {
            getStudentPlot(student_data)
            .then(response => {
                studentCompetencyPerformance(response, plots);
            })
            .catch(error => console.log(error));

            getStudentInteractionsNum(student_data)
            .then(response => {
                studentInteractionsOva(response, plots);
            })
            .catch(error => console.log(error));
        };
        options.insertBefore(plots);
    }
    // if the ova select change, also changes the ova plot
    ovas.on("change", () => {
        const option = $(this).find("option:selected");
        if (option.val() != "") ovaListener(option);
    });
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

function getStudentInteractionsNum(data) {
    const url = "/plot/interaction/ova"
    return doRequest(url, data, "POST")
}

/*
// calls the request function with the parameters for get the competency plot
function getCompetencyPlot(data) {
    const url = "/plot/competency";
    return doRequest(url, data, "POST");
}
*/

// plot the graph of the students of the course performance grouped by competencies
function studentCompetencyPerformance(response, plots) {
    const plot = $(`<div id="plot-1"></div>`);
    plots.append(plot);
    const byCompetencies = response.data;
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
        showlegend: false,
        width: plots.width(),
        font: {
            size: 12
        },
        xaxis: {
            tickangle: 20,
            title: "Competências por disciplina"
        },
        yaxis: {
            tickformat: "2%",
            title: "% de respostas certas"
        },
    };

    // set the data for the plot and its plot options

    const getPercColor = (perc) => {
        const colors = {
            0.0: "rgb(173, 254, 255)",
            0.1: "rgb(156, 229, 241)",
            0.2: "rgb(138, 206, 226)",
            0.3: "rgb(121, 179, 212)",
            0.4: "rgb(104, 154, 198)",
            0.5: "rgb(87, 129, 184)",
            0.6: "rgb(69, 104, 169)",
            0.7: "rgb(52, 79, 155)",
            0.8: "rgb(35, 54, 141)",
            0.9: "rgb(17, 29, 126)",
            1.0: "rgb(0, 4, 112)"
        };

        const step = 2;
        let idx = 0.0;
        for (let i = 0.0; i <= 1.0; i += 0.1 * step) {
            if (perc < i) break;
            idx = i;
        }

        return colors[Math.round(10 * idx) / 10];
    };
    
    const data = {
        type: "bar",
        x: [],
        y: [],
        marker: {
            color: []
        },
        font: {
            size: 12
        },
        xaxis: {
            tickangle: 20
        },
        text: [],
        customdata: [],
        textposition: "outside",
        hovertemplate:
        `<b>%{customdata}</b>`
    };

    for (let j = 0; j < byCompetencies.length; j++) {
        let answers = byCompetencies[j][1];
        let num_questions = byCompetencies[j][2];
        let perc = answers / num_questions;
        console.log(answers, num_questions, perc)

        data.x.push(`Competência ${j + 1}`);
        data.customdata.push(byCompetencies[j][0]);
        data.y.push(perc);
        if (perc == 0) data.text.push("");
        else data.text.push(`${answers}/${num_questions} - Comp.${j + 1}`);
        let rgb = getPercColor(perc);
        data.marker.color.push(rgb);
    }

    console.log(data)

    Plotly.newPlot(`plot-1`, [data], layout, config);
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
}

function studentInteractionsOva(response, plots) {
    const plot = $(`<div id="plot-4"></div>`);
    plots.append(plot);

    // set the configurations of the plot
    const config = {
        responsive: true,
        displayModeBar: false,
        scrollZoom: true
    };

    // set the plot layout
    const layout = {
        width: plots.width(),
        font: {
            size: 12
        },
        xaxis: {
            tickangle: 20
        },
        yaxis: {
            tickformat: "2%",
            range: [0, 1]
        }
    };

    const num_interactions = response.num_interactions;
    const total_interactions = sessionStorage.getItem("total_interactions");

    // set the data for the plot and its plot options
    const data = [{
        type:"bar",
        x: ["Interactions"],
        y: [num_interactions / total_interactions],
        text: [`${num_interactions} / ${total_interactions}`],
        textposition: "outside",
        font: {
            size: 12
        },
        xaxis: {
            tickangle: 20
        }
    }];

    // set the plot with the properties
    Plotly.newPlot(`plot-4`, data, layout, config);
}

/*
// plot the graph for the performance of a competency with all the students
function competencyGeneralPerformance(response, plots) {
    const plot = $(`<div id="plot-4"></div>`);
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
    Plotly.newPlot(`plot-4`, data, layout, config);
}
*/