import { doRequest } from "./request.js";

$(document).ready(function() {
    localStorage.clear();
    localStorage.setItem("logged", false);

    const togglePassword = $(".toggle-password");
    const raInput = $("#ra-input");
    const passwordInput = $("#password-input");
    const loginButton = $(".login-button");
    const loginTab = $("#login");
    const chooseCoursesTab = $("#choose-course");
    const filterOptions = $(".filter-option");
    const ovaList = $(".ova-list");

    togglePassword.on("click", function() {
        if (!togglePassword.hasClass("bi-eye-slash-fill")) {
            passwordInput.attr("type", "text");
            togglePassword.addClass("bi-eye-slash-fill");
        } else {
            passwordInput.attr("type", "password");
            togglePassword.removeClass("bi-eye-slash-fill");
        }
    });

    filterOptions.each(index => {
        const option = filterOptions.eq(index);
        option.on("click", async function() {
            filterOptions.prop("checked", false);
            option.prop("checked", true);
            await getOVAs(option.val())
            .then(response => makeOVAOptions(response, ovaList))
            .catch(error => console.log(error));
        });
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
            localStorage.setItem("course_id", response.ids.course_id);
            localStorage.setItem("ra", response.ids.ra);
        }).catch(error => {
            statusBar.html(error.responseText);
            statusBar.addClass("bg-danger");
            statusBarAnimation(statusBar);
        });
        if (JSON.parse(localStorage.getItem("logged")) === true) {
            setTimeout(async function() {
                loginTab.addClass("d-none");
                chooseCoursesTab.removeClass("d-none");
                const option = $(".filter-option:checked");
                await getOVAs(option.val())
                .then(response => makeOVAOptions(response, ovaList))
                .catch(error => console.log(error));
            }, 500);
        }
    });
});

function login(user_data) {
    const url = "/login";
    return doRequest(url, user_data, "POST", true);
}

function getOVAs(option) {
    const course_id = localStorage.getItem("course_id")
    const url = (option === "all") ? "/ova/all" : `/ova/${course_id}`;
    return doRequest(url, {}, "GET");
}

function makeOVAOptions(response, ovaList) {
    ovaList.html("");
    for (let i = 0; i < response.length; i++) {
        const ova = response[i];
        const imageName = ova.link.split(".")[0];
        const listItem = $(`
        <li class="ova-item list-group-item d-flex flex-column justify-content-between align-items-center rounded-3 shadow">
            <a class="align-self-start" href="${ova.link}">
                <p><span class="fw-bold">Nome:</span> ${ova.ova_name}</p>
                <p><span class="fw-bold">Complexidade:</span> ${ova.complexity}</p>
                <img class="img-fluid w-100 ova-img rounded-3 shadow" src="../imagens/${imageName}.png" alt="" srcset="">
            </a>
        </li>
        `);
        listItem.on("click", function() {
            localStorage.setItem("ova_id", ova.ova_id);
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