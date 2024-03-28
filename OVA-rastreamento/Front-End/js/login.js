import { doRequest } from "./request.js";

$(document).ready(function() {
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
        let logged = false;
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
            logged = true;
            localStorage.setItem("course_id", response.course_id);
        }).catch(error => {
            statusBar.html(error.responseText);
            statusBar.addClass("bg-danger");
            statusBarAnimation(statusBar);
        });
        if (logged) {
            const login = $("#login");
            const chooseCourses = $("#choose-course");
            login.addClass("d-none");
            chooseCourses.removeClass("d-none");
            await getOVAs(localStorage.getItem("course_id"))
            .then(response => {
                const ova_list = $(".ova-list");
                for (let i = 0; i < response.length; i++) {
                    const ova = response[i];
                    ova_list.append(
                        `
                        <li class="list-group-item">
                           <a href="quantum-computing.html">
                            <p><span class="fw-bold">Nome:</span> ${ova.ova_name}</p>
                            <p><span class="fw-bold">Complexidade:</span> ${ova.complexity}</p>
                           </a>
                        </li>
                        `
                    );
                }
            })
            .catch(error => console.log(error));
        }
    });


});

function login(user_data) {
    const url = "http://localhost:8000/login";
    return doRequest(url, user_data, "POST", true);
}

function getOVAs(course_id) {
    const url = `http://localhost:8000/ova/${course_id}`;
    return doRequest(url, {}, "GET");
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

function makeOVA(course) {

}