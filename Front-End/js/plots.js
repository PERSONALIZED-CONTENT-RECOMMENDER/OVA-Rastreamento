import { 
    getCourses, 
    getCourseSubjects, 
    getSubjectOVAs,
    getStudentPlot,
    getCoursePlot,
    getOVAPlot,
    getStudentsByCourse,
    getStudentInteractionsNum,
    // getAllCompetencies
} from "./request.js";

import {
    makeCourseOptions, 
    makeStudentOptions, 
    makeOVAsOptions, 
    makeSubjectsOptions, 
    // makeCompetenciesOptions
} from "./make.js";

// Importing necessary functions from the request.js module.

$(document).ready(function () {
    sessionStorage.setItem("past_page", "plot"); // Setting the past page in session storage to "plot".
    const backButton = $(".back-button"); // Selecting the back button element.
    const plots = $(".plots"); // Selecting the plots container element.

    // Verify if the user is admin or not
    const is_admin = JSON.parse(localStorage.getItem("is_admin")); // Checking if the user is an admin.
    let backButtonLink; // Variable to store the back button link.
    
    // If admin, the back button goes back to login html
    if (is_admin == true) backButtonLink = "login.html"; // Set link to login page for admin.
    else {
        // Else, the back button goes back to the OVA that the student was reading
        const ova_id = localStorage.getItem("ova_id"); // Retrieving the OVA ID from local storage.
        if (ova_id == null) backButtonLink = "login.html"; // If no OVA ID, set link to login page.
        else backButtonLink = `./iframe.html`; // Otherwise, set link to the iframe page.
    }
    backButton.attr("href", backButtonLink); // Setting the back button link.

    const options = $(`
        <div class="options mt-5">
            <div id="choose-subject" class="mb-3">
                <label for="subjects">Subjects:</label>
                <select name="" id="subjects" class="form-select">
                    <option value=""></option>
                </select>
            </div>
            <div id="choose-ova" class="mb-3 d-none">
                <label for="ovas">Ovas:</label>
                <select name="" id="ovas" class="form-select">
                    <option value=""></option>
                </select>
            </div>
        </div>
    `); // Creating a dropdown for selecting subjects and OVAs.

    const subjects = options.find("#subjects"); // Selecting the subjects dropdown.
    const ovas = options.find("#ovas"); // Selecting the OVAs dropdown.

    // Fetching course subjects and populating the subjects dropdown.
    getCourseSubjects(localStorage.getItem("course_id"))
    .then(response => makeSubjectsOptions(response, subjects))
    .catch(error => console.log(error)); // Logging errors in fetching subjects.

    let subjectListener; // Variable to store the subject change listener function.

    /*
    If admin, show admin options at the plot page, and let the coordinator
    see information about all the courses and all the students.
    */
    if (is_admin == true) {
        options.find("#choose-subject").addClass("d-none"); // Hiding subject selection for admin.
        options.find("#choose-ova").addClass("d-none"); // Hiding OVA selection for admin.

        // Creating dropdown for selecting courses.
        const courseOption = $(`
            <div id="choose-course" class="mb-3">
                <label for="courses">Curso:</label>
                <select name="" id="courses" class="form-select">
                    <option value=""></option>
                </select>
            </div>
        `);
        // Creating dropdown for selecting students.
        const studentOption = $(`
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

        const courses = courseOption.find("#courses"); // Selecting the courses dropdown.
        const students = studentOption.find("#students"); // Selecting the students dropdown.
        // const competencies = adminOptions.find("#competencies"); // Selecting competencies dropdown (commented out).

        // Send a request to the API to get all the courses.
        getCourses()
        .then(response => makeCourseOptions(response, courses)) // Populating the courses dropdown.
        .catch(error => console.log(error)); // Logging errors in fetching courses.

        // Send a request to the API to get all the competencies (commented out).
        /*
        getAllCompetencies()
        .then(response => makeCompetenciesOptions(response, competencies))
        .catch(error => console.log(error));
        */

        /*
        If the admin changes the course select, updates the student
        select and the course plot.
        */
        courses.on("change", function() {
            if (subjects.parent().hasClass("d-none")) {
                subjects.parent().removeClass("d-none"); // Show subjects dropdown if hidden.
            }
            students.html(`<option value=""></option>`); // Clear students dropdown.
            const option = courses.find("option:selected"); // Get selected course.
            if (option.val() != "") {
                students.append($(
                    `<option class="all-students" value="0">Todos</option>` // Adding an option for all students.
                ));
                // Fetching students by the selected course.
                getStudentsByCourse(option.val())
                .then(response => makeStudentOptions(response, students)) // Populating students dropdown.
                .catch(error => console.log(error)); // Logging errors in fetching students.

                // Fetching and displaying the course plot.
                getCoursePlot({"course_id": option.val()})
                .then(response => courseGeneralPerformance(response, plots))
                .catch(error => console.log(error)); // Logging errors in fetching course plot.
            }
        });

        /*
        If the student select changes, update the student plot.
        */
        students.on("change", function() {
            if (ovas.parent().hasClass("d-none")) {
                ovas.parent().removeClass("d-none"); // Show OVAs dropdown if hidden.
            }

            const data = {
                // "ova_id": option.val(),
                "course_id": courses.find("option:selected").val(), // Get selected course ID.
                "student_id": students.find("option:selected").val(), // Get selected student ID.
                "subject_id": subjects.find("option:selected").val() // Get selected subject ID.
            };

            // Fetching and displaying the student plot.
            getStudentPlot(data)
            .then(response => studentCompetencyPerformance(response, plots))
            .catch(error => console.log(error)); // Logging errors in fetching student plot.
        });

        subjectListener = (option) => {
            if (students.parent().hasClass("d-none")) {
                students.parent().removeClass("d-none"); // Show students dropdown if hidden.
            }

            // getOVAPlot(data)
            // .then(response => ovaGeneralPerformance(response, plots))
            // .catch(error => console.log(error));
        };

        // If the competency select changes, also changes the OVA plot (commented out).
        /*
        competencies.on("change", function() {
            const option = $(this).find("option:selected");
            if (option.val() != "") {
                const competency_data = {
                    "competency_id": option.val(),
                    "course_id": courses.find("option:checked").val()
                }
                getCompetencyPlot(competency_data) // Fetching competency plot.
                .then(response => competencyGeneralPerformance(response, plots))
                .catch(error => console.log(error)); // Logging errors in fetching competency plot.
            }
        });
        */

        // Inserting the course and student selection options before the subject options.
        courseOption.insertBefore(options.find("#choose-subject"));
        studentOption.insertBefore(options.find("#choose-ova"));
    } else {
        // If not admin, the student only sees their performance.
        const student_data = {
            "student_id": localStorage.getItem("student_id"), // Getting student ID from local storage.
            "course_id": localStorage.getItem("course_id") // Getting course ID from local storage.
        };

        subjectListener = (option) => {
            student_data["subject_id"] = option.val(); // Updating the subject ID in student data.
            // Fetching and displaying the student plot.
            getStudentPlot(student_data)
            .then(response => studentCompetencyPerformance(response, plots))
            .catch(error => console.log(error)); // Logging errors in fetching student plot.
        };
    }
    options.insertBefore(plots); // Inserting the options before the plots container.
    // If the OVA select changes, also changes the OVA plot.
    subjects.on("change", () => {
        const option = subjects.find("option:selected"); // Getting the selected subject.
        localStorage.setItem("subject_id", option.val()); // Storing the selected subject ID in local storage.
        if (option.val() != "") subjectListener(option); // Calling the subject listener if a subject is selected.

        // If the user is an admin, show the students dropdown.
        if (is_admin == true) {
            const students = options.find("#choose-student"); // Selecting the students dropdown.
            if (students.parent().hasClass("d-none")) {
                students.parent().removeClass("d-none"); // Show students dropdown if hidden.
            }
        } else {
            // If not admin, show the OVAs dropdown.
            if (ovas.parent().hasClass("d-none")) {
                ovas.parent().removeClass("d-none"); // Show OVAs dropdown if hidden.
            }
        }

        ovas.html(`<option value=""></option>`); // Clear OVAs dropdown.

        // Fetching OVAs based on the selected subject.
        getSubjectOVAs(option.val())
        .then(response => makeOVAsOptions(response, ovas)) // Populating OVAs dropdown.
        .catch(error => console.log(error)); // Logging errors in fetching OVAs.
    });

    // Handling change event for OVAs.
    ovas.on("change", async () => {
        const option = ovas.find("option:selected"); // Getting the selected OVA.

        const ova_data = {
            "ova_id": option.val(), // Storing the selected OVA ID.
            "student_id": localStorage.getItem("student_id"), // Getting student ID from local storage.
            "course_id": localStorage.getItem("course_id"), // Getting course ID from local storage.
            "subject_id": localStorage.getItem("subject_id") // Getting subject ID from local storage.
        };

        // Fetching and displaying the student plot for the selected OVA.
        await getStudentPlot(ova_data)
        .then(response => studentCompetencyPerformance(response, plots, true))
        .catch(error => console.log(error)); // Logging errors in fetching student plot.

        // If the user is an admin, fetch and display the OVA plot.
        if (is_admin == true) {
            await getOVAPlot(ova_data)
            .then(response => ovaGeneralPerformance(response, plots))
            .catch(error => console.log(error)); // Logging errors in fetching OVA plot.
        }

        // Fetching and displaying the number of interactions for the selected OVA.
        await getStudentInteractionsNum(ova_data)
        .then(response => studentInteractionsOva(response, plots))
        .catch(error => console.log(error)); // Logging errors in fetching student interactions.
    });
});

/*
// Calls the request function with the parameters to get the competency plot
function getCompetencyPlot(data) {
    const url = "/plot/competency"; // Defining the endpoint URL for competency plot.
    return doRequest(url, data, "POST"); // Making a POST request to retrieve the competency plot data.
}
*/

// Plots the graph of student performance in the course, grouped by competencies
function studentCompetencyPerformance(response, plots, single_ova=false) {
    let plot;

    if (single_ova) {
        plot = $(`<div id="plot-5"></div>`); // Creating a div for the plot when a single OVA is selected.
        plot.insertAfter(plots.find("#plot-1")); // Inserting the plot after the first plot.
    } else plot = $(`<div id="plot-1"></div>`); // Creating a div for the first plot when multiple OVAs are selected.

    plots.append(plot); // Appending the plot to the plots container.
    const byCompetencies = response.data; // Extracting data grouped by competencies from the response.

    // Set the configurations for the plot
    const config = {
        responsive: true, // Making the plot responsive to screen size.
        displayModeBar: false, // Hiding the mode bar.
        scrollZoom: true // Enabling scroll zoom functionality.
    };

    // Set the plot layout
    const layout = {
        title: "Desempenho do aluno por competência" + ((single_ova) ? " em 1 OVA" : ""), // Title of the plot indicating performance by competency.
        showlegend: false, // Hiding the legend.
        width: plots.width(), // Setting the width of the plot based on the container width.
        font: {
            size: 12 // Font size for the plot.
        },
        xaxis: {
            tickangle: 20, // Angling the x-axis ticks.
            title: "Competências por disciplina" // Title for the x-axis.
        },
        yaxis: {
            tickformat: "2%", // Formatting y-axis ticks as percentages.
            title: "% de respostas certas", // Title for the y-axis.
            range: [0, 1] // Setting the y-axis range from 0 to 1.
        },
    };

    // Set the data for the plot and its options
    const getPercColor = (perc) => {
        const colors = { // Color mapping for different percentage ranges.
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

        const step = 2; // Defining the step for percentage.
        let idx = 0.0; // Initializing index for percentage.
        for (let i = 0.0; i <= 1.0; i += 0.1 * step) { // Looping through percentage ranges.
            if (perc < i) break; // Breaking the loop if current percentage is less than the index.
            idx = i; // Updating the index to the current value.
        }

        return colors[Math.round(10 * idx) / 10]; // Returning the color corresponding to the percentage.
    };
    
    const data = {
        type: "bar", // Defining the type of plot as a bar chart.
        x: [], // Array to hold x-axis values (competencies).
        y: [], // Array to hold y-axis values (percentage of correct answers).
        marker: {
            color: [] // Array to hold colors for each bar.
        },
        font: {
            size: 12 // Font size for the bars.
        },
        xaxis: {
            tickangle: 20 // Setting the angle for x-axis ticks.
        },
        text: [], // Array to hold text labels for the bars.
        customdata: [], // Array to hold custom data for hover.
        textposition: "outside", // Positioning text labels outside the bars.
        hovertemplate:
        `<b>%{customdata}</b>` // Template for hover information.
    };

    for (let j = 0; j < byCompetencies.length; j++) {
        let answers = byCompetencies[j][1]; // Getting the number of correct answers.
        let num_questions = byCompetencies[j][2]; // Getting the total number of questions.
        let perc = answers / num_questions; // Calculating percentage of correct answers.

        data.x.push(`Competência ${j + 1}`); // Adding competency label to x-axis data.
        data.customdata.push(byCompetencies[j][0]); // Storing additional data for hover.
        data.y.push(perc); // Adding percentage to y-axis data.
        if (perc == 0) data.text.push(""); // If no correct answers, no text label.
        else data.text.push(`${answers}/${num_questions} - Comp.${j + 1}`); // Adding text label with answer count and competency number.
        let rgb = getPercColor(perc); // Getting color based on percentage.
        data.marker.color.push(rgb); // Adding color to the marker for the bar.
    }

    Plotly.newPlot(`plot-${single_ova ? 5 : 1}`, [data], layout, config); // Creating the plot with the specified data, layout, and configuration.
}

// Plots the graph of the general students performances in the course
function courseGeneralPerformance(response, plots) {
    const plot = $(`<div id="plot-2"></div>`); // Creating a new div element for the course performance plot.
    plots.append(plot); // Appending the new plot div to the plots container.

    // Set the configurations of the plot
    const config = {
        responsive: true, // Makes the plot responsive to screen size.
        displayModeBar: false, // Hides the mode bar in the plot.
        scrollZoom: true // Enables scroll zoom functionality.
    };

    // Set the plot layout
    const layout = {
        title: response.title, // Setting the title of the plot from the response.
        barmode: "group", // Groups bars together for comparison.
        width: plots.width(), // Sets the width of the plot based on the container width.
        font: {
            size: 12 // Sets the font size for the plot.
        },
        xaxis: {
            tickangle: 20 // Angles the x-axis ticks for better readability.
        },
        yaxis: {
            tickformat: "2%", // Formats y-axis ticks as percentages.
            range: [0, 1] // Sets the range for the y-axis from 0 to 1.
        }
    };

    // Set the data for the plot and its options
    const data = [{
        x: response.data.students, // Assigning student names to x-axis data.
        y: response.data.perc, // Assigning performance percentages to y-axis data.
        type: response.type, // Setting the type of plot (e.g., bar, line) from the response.
        font: {
            size: 12 // Setting font size for the data.
        },
        xaxis: {
            tickangle: 20 // Angling the x-axis ticks.
        }
    }];

    Plotly.newPlot(`plot-2`, data, layout, config); // Creating the plot with the specified data, layout, and configuration.
}

// Plots the graph for the performance of an OVA with all the students
function ovaGeneralPerformance(response, plots) {
    const plot = $(`<div id="plot-3"></div>`); // Creating a new div element for the OVA performance plot.
    plot.insertBefore(plots.find("#plot-1")); // Inserting the OVA plot before the first plot in the container.

    // Set the configurations of the plot
    const config = {
        responsive: true, // Makes the plot responsive to screen size.
        displayModeBar: false, // Hides the mode bar in the plot.
        scrollZoom: true // Enables scroll zoom functionality.
    };

    // Set the plot layout
    const layout = {
        title: response.title, // Setting the title of the plot from the response.
        barmode: "group", // Groups bars together for comparison.
        width: plots.width(), // Sets the width of the plot based on the container width.
        font: {
            size: 12 // Sets the font size for the plot.
        },
        xaxis: {
            tickangle: 20 // Angles the x-axis ticks for better readability.
        },
        yaxis: {
            tickformat: "2%", // Formats y-axis ticks as percentages.
            range: [0, 1] // Sets the range for the y-axis from 0 to 1.
        }
    };

    // Set the data for the plot and its options
    const data = [{
        x: response.data.students, // Assigning student names to x-axis data.
        y: response.data.perc, // Assigning performance percentages to y-axis data.
        type: response.type, // Setting the type of plot (e.g., bar, line) from the response.
        font: {
            size: 12 // Setting font size for the data.
        },
        xaxis: {
            tickangle: 20 // Angling the x-axis ticks.
        }
    }];

    // Set the plot with the properties
    Plotly.newPlot(`plot-3`, data, layout, config); // Creating the plot with the specified data, layout, and configuration.
}

function studentInteractionsOva(response, plots) {
    const plot = $(`<div id="plot-4"></div>`); // Creating a new div element for the student interactions plot.
    plots.append(plot); // Appending the new plot div to the plots container.

    // Set the configurations of the plot
    const config = {
        responsive: true, // Makes the plot responsive to screen size.
        displayModeBar: false, // Hides the mode bar in the plot.
        scrollZoom: true // Enables scroll zoom functionality.
    };

    // Set the plot layout
    const layout = {
        title: "Interações feitas no OVA", // Setting the title of the plot.
        width: plots.width(), // Sets the width of the plot based on the container width.
        font: {
            size: 12 // Sets the font size for the plot.
        },
        xaxis: {
            tickangle: 20 // Angles the x-axis ticks for better readability.
        },
        yaxis: {
            tickformat: "2%", // Formats y-axis ticks as percentages.
            range: [0, 1] // Sets the range for the y-axis from 0 to 1.
        }
    };

    const num_interactions = response.num_interactions; // Getting the number of interactions from the response.
    const total_interactions = sessionStorage.getItem("total_interactions"); // Retrieving the total number of interactions from session storage.
    const perc = num_interactions / total_interactions; // Calculating the percentage of interactions.

    // Set the data for the plot and its options
    const data = [{
        type: "bar", // Setting the type of plot to bar chart.
        x: ["Interactions"], // Setting x-axis label for interactions.
        y: [perc], // Setting the percentage of interactions for the y-axis.
        textposition: "outside", // Positioning the text labels outside the bars.
        font: {
            size: 12 // Setting font size for the data.
        },
        xaxis: {
            tickangle: 20 // Angling the x-axis ticks.
        }
    }];

    if (perc > 0) data[0].text = [`${num_interactions} / ${total_interactions}`]; // If interactions are greater than zero, set the text for the bar.

    // Set the plot with the properties
    Plotly.newPlot(`plot-4`, data, layout, config); // Creating the plot with the specified data, layout, and configuration.
}

/*
// Plots the graph for the performance of a competency with all the students
function competencyGeneralPerformance(response, plots) {
    const plot = $(`<div id="plot-4"></div>`); // Creating a new div element for the competency performance plot.
    plots.append(plot); // Appending the new plot div to the plots container.

    // Set the configurations of the plot
    const config = {
        responsive: true, // Makes the plot responsive to screen size.
        displayModeBar: false, // Hides the mode bar in the plot.
        scrollZoom: true // Enables scroll zoom functionality.
    };

    // Set the plot layout
    const layout = {
        title: response.title, // Setting the title of the plot from the response.
        barmode: "group", // Groups bars together for comparison.
        width: plots.width(), // Sets the width of the plot based on the container width.
        font: {
            size: 12 // Sets the font size for the plot.
        },
        xaxis: {
            tickangle: 20 // Angles the x-axis ticks for better readability.
        },
        yaxis: {
            tickformat: "2%" // Formats y-axis ticks as percentages.
        }
    };

    // Set the data for the plot and its options
    const data = [{
        x: response.data.students, // Assigning student names to x-axis data.
        y: response.data.perc, // Assigning performance percentages to y-axis data.
        type: response.type, // Setting the type of plot (e.g., bar, line) from the response.
        font: {
            size: 12 // Setting font size for the data.
        },
        xaxis: {
            tickangle: 20 // Angling the x-axis ticks.
        }
    }];

    // Set the plot with the properties
    Plotly.newPlot(`plot-4`, data, layout, config); // Creating the plot with the specified data, layout, and configuration.
}
*/