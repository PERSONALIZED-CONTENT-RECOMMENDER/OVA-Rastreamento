import { doRequest, makeCourseOptions, getCourses } from "./request.js";

$(document).ready(function() {
    const loginTab = $("#login");
    const chooseOVAsTab = $("#choose-ova");
    const ovaDiv = $(".ova-div");
    const logoutButton = $(".logout-button");

    const is_admin = JSON.parse(localStorage.getItem("is_admin"));

    /*
    if the previous page was plot page, show the page to choose the OVA
    else go to login page, meaning that the user doesn't logged or
    made logout
    */
    if (sessionStorage.getItem("past_page") == "plot") {
        if (is_admin == true) {
            localStorage.clear();
            localStorage.setItem("logged", false);
            loginTab.removeClass("d-none");
            chooseOVAsTab.addClass("d-none");
        } else {
            loginTab.addClass("d-none");
            chooseOVAsTab.removeClass("d-none");
            makeStudentOVAs(ovaDiv);
        }
    } else {
        localStorage.clear();
        localStorage.setItem("logged", false);
    }

    // define the variables
    const togglePassword = $(".toggle-password");
    const raInput = $("#ra-input");
    const passwordInput = $("#password-input");
    const loginButton = $(".login-button");

    // this function toggle the password visibility
    togglePassword.on("click", function() {
        if (!togglePassword.hasClass("bi-eye-slash-fill")) {
            passwordInput.attr("type", "text");
            togglePassword.addClass("bi-eye-slash-fill");
        } else {
            passwordInput.attr("type", "password");
            togglePassword.removeClass("bi-eye-slash-fill");
        }
    });

    loginButton.on("click", async function(e) {
        const statusBar = $(".login-form").find(".status-bar");
        e.preventDefault();
        // get the form data for the request
        const user_data = {
            ra: raInput.val(),
            password: passwordInput.val()
        };
        // send the login data to the API to validation
        await login(user_data)
        .then(response => {
            /*
            if it goes well, goes to the next page
            */
            statusBar.html(response.Message);
            statusBar.removeClass("bg-danger");
            statusBarAnimation(statusBar);
            // clear the inputs
            raInput.val("");
            passwordInput.val("");
            // put the information received in the localstorage
            localStorage.setItem("logged", true);
            localStorage.setItem("is_admin", response.is_admin);
            localStorage.setItem("course_id", response.ids.course_id);
            localStorage.setItem("student_id", response.ids.student_id);

            // do this if the user logged succesfully
            const isAdmin = JSON.parse(localStorage.getItem("is_admin"));
            if (JSON.parse(localStorage.getItem("logged")) === true) {
                setTimeout(async function() {
                    
                    // if the user is admin, go to the administrator's plot page
                                        // define the windows html link
                    if (isAdmin == true) window.location.href = "plots.html";
                    else {
                        // else, go to choose the ova page
                        loginTab.addClass("d-none");
                        chooseOVAsTab.removeClass("d-none");

                        // get the OVAs of the student's course to the choice
                        await makeStudentOVAs(ovaDiv);
                    }
                }, 500);
            }
        }).catch(error => {
            // if the request return an error, shows it in a red bar
            statusBar.html(error.responseText);
            statusBar.addClass("bg-danger");
            statusBarAnimation(statusBar);
        });
    });

    // make logout and goes back to the login page
    logoutButton.on("click", function() {
        loginTab.removeClass("d-none");
        chooseOVAsTab.addClass("d-none");
        // defines the past page as the choose ova page
        sessionStorage.setItem("past_page", "choose-ova");
    });
});

// calls the request function with the parameters for login
function login(user_data) {
    const url = "/login";
    return doRequest(url, user_data, "POST", true);
}

// do the request of the student's OVAs and renders the items grouped by subject
async function makeStudentOVAs(ovaDiv) {
    await getOVAs(localStorage.getItem("course_id"))
    .then(response => {
        for (let subject in response) {
            // create the html dinamically for the subject div
            const subjectDiv = $(`
                <div class="py-3 border-top">
                    <h2 class="subject text-center">${subject}</h2>
                    <ul class="list-group list-group-horizontal-md d-flex flex-wrap w-100 ova-list p-3"></ul>
                </div>
            `);
            // calls the function to render the OVAs of each subject
            makeOVAOptions(response[subject], subjectDiv.find(".ova-list"));
            ovaDiv.append(subjectDiv);
        }
    })
    .catch(error => console.log(error));
}

// calls the request function with the parameters for get the OVAs of a course
function getOVAs(course_id) {
    return doRequest(`/ova/course/${course_id}`, {}, "GET");
}

// make the html for each OVA dinamically and append to the course div
function makeOVAOptions(response, ovaList) {
    const ovas = response.ovas;
    ovaList.html("");
    for (let i = 0; i < ovas.length; i++) {
        const ova = ovas[i];
        const listItem = $(`
        <li class="ova-item list-group-item d-flex flex-column justify-content-between align-items-center rounded-3 shadow">
            <a class="align-self-start" href="./iframe.html">
                <p><span class="fw-bold">Nome:</span> ${ova.ova_name}</p>
            </a>
        </li>
        `);
        listItem.on("click", function() {
            // put the id and the link of the ova that was clicked
            localStorage.setItem("ova_id", ova.ova_id);
            localStorage.setItem("ova_link", `${ova.link}`);
            window.location.href = "iframe.html";
            localStorage.setItem("subject_id", response.subject_id);
        });
        ovaList.append(listItem);
    }
}

// animation of the error/success bar
function statusBarAnimation(statusBar) {
    statusBar.animate({
        top: "37px"
    }, 100);
    setTimeout(function() {
        statusBar.animate({
            top: "5px"
        }, 100);
    }, 1000);
    
}