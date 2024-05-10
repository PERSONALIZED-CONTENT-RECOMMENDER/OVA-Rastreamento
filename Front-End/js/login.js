import { doRequest, makeCourseOptions, getCourses } from "./request.js";

$(document).ready(function() {
    const loginTab = $("#login");
    const chooseOVAsTab = $("#choose-ova");
    const ovaDiv = $(".ova-div");
    const logoutButton = $(".logout-button");

    if (sessionStorage.getItem("past_page") == "plot") {
        loginTab.addClass("d-none");
        chooseOVAsTab.removeClass("d-none");
        makeStudentOVAs(ovaDiv);
    } else {
        localStorage.clear();
        localStorage.setItem("logged", false);
    }

    const togglePassword = $(".toggle-password");
    const raInput = $("#ra-input");
    const passwordInput = $("#password-input");
    const loginButton = $(".login-button");

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
        const user_data = {
            ra: raInput.val(),
            password: passwordInput.val()
        };
        await login(user_data)
        .then(response => {
            statusBar.html(response.Message);
            statusBar.removeClass("bg-danger");
            statusBarAnimation(statusBar);
            raInput.val("");
            passwordInput.val("");
            localStorage.setItem("logged", true);
            localStorage.setItem("is_admin", response.is_admin);
            localStorage.setItem("course_id", response.ids.course_id);
            localStorage.setItem("student_id", response.ids.student_id);

            const isAdmin = JSON.parse(localStorage.getItem("is_admin"));
            if (JSON.parse(localStorage.getItem("logged")) === true) {
                setTimeout(async function() {
        
                    if (isAdmin == true) window.location.href = "plots.html";
                    else {
                        loginTab.addClass("d-none");
                        chooseOVAsTab.removeClass("d-none");

                        await makeStudentOVAs(ovaDiv);
                    }
                }, 500);
            }
        }).catch(error => {
            statusBar.html(error.responseText);
            statusBar.addClass("bg-danger");
            statusBarAnimation(statusBar);
        });
    });

    logoutButton.on("click", function() {
        loginTab.removeClass("d-none");
        chooseOVAsTab.addClass("d-none");
        sessionStorage.setItem("past_page", "choose-ova");
    });
});

function login(user_data) {
    const url = "/login";
    return doRequest(url, user_data, "POST", true);
}

async function makeStudentOVAs(ovaDiv) {
    await getOVAs(localStorage.getItem("course_id"))
    .then(response => {
        for (let subject in response) {
            const subjectDiv = $(`
                <div class="py-3 border-top">
                    <h2 class="subject text-center">${subject}</h2>
                    <ul class="list-group list-group-horizontal-md d-flex flex-wrap w-100 ova-list p-3"></ul>
                </div>
            `);
            makeOVAOptions(response[subject], subjectDiv.find(".ova-list"));
            ovaDiv.append(subjectDiv);
        }
    })
    .catch(error => console.log(error));
}

function getOVAs(course_id) {
    return doRequest(`/ova/course/${course_id}`, {}, "GET");
}

function makeOVAOptions(response, ovaList) {
    ovaList.html("");
    for (let i = 0; i < response.length; i++) {
        const ova = response[i];
        const listItem = $(`
        <li class="ova-item list-group-item d-flex flex-column justify-content-between align-items-center rounded-3 shadow">
            <a class="align-self-start" href="./iframe.html">
                <p><span class="fw-bold">Nome:</span> ${ova.ova_name}</p>
                <p><span class="fw-bold">Competência:</span> ${ova.competency_description}</p>
            </a>
        </li>
        `);
        listItem.on("click", function() {
            localStorage.setItem("ova_id", ova.ova_id);
            localStorage.setItem("ova_link", `${ova.link}`);
        });
        ovaList.append(listItem);
    }
}

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