import { doRequest, makeCourseOptions, getCourses } from "./request.js";

$(document).ready(function() {
    localStorage.clear();
    localStorage.setItem("logged", false);

    const togglePassword = $(".toggle-password");
    const raInput = $("#ra-input");
    const passwordInput = $("#password-input");
    const loginButton = $(".login-button");
    const loginTab = $("#login");
    const chooseOVAsTab = $("#choose-ova");
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
            localStorage.setItem("ra", response.ids.ra);

            const isAdmin = JSON.parse(localStorage.getItem("is_admin"));
            if (JSON.parse(localStorage.getItem("logged")) === true) {
                setTimeout(async function() {
                    loginTab.addClass("d-none");
                    chooseOVAsTab.removeClass("d-none");
        
                    if (isAdmin == true) {
                        const adminForm = $(`
                            <form action="#" class="filter">
                                <div class="form-check">
                                    <input class="form-check-input filter-option" type="checkbox" value="all" id="all-ova">
                                    <label class="form-check-label" for="all-ova">Todos</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input filter-option" type="checkbox" value="course" id="course-ova">
                                    <label class="form-check-label" for="course-ova">Por Curso</label>
                                </div>
                                <div class="course-select mb-3 d-none">
                                    <label for="courses">Curso:</label>
                                    <select name="" id="courses" class="form-select">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </form>
                        `);

                        const courses = adminForm.find("#courses");
                        const filterOptions = adminForm.find(".filter-option");

                        getCourses()
                        .then(response => makeCourseOptions(response, courses))
                        .catch(error => console.log(error));
                        
                        courses.on("change", async function() {
                            const option = $(this).find("option:selected");
                            if (option.val() != "") {
                                const checked = filterOptions.find(":checked");
                                await getOVAsAdmin(checked.val(), courses)
                                .then(response => makeOVAOptions(response, ovaList))
                                .catch(error => console.log(error));
                            }
                        });

                        filterOptions.on("change", async function() {
                            filterOptions.prop("checked", false);
                            $(this).prop("checked", true);
                            const select = adminForm.find(".course-select");
                            if ($(this).attr("id") == "all-ova") {
                                select.addClass("d-none");
                                await getOVAsAdmin($(this).val(), adminForm.find("#courses"))
                                .then(response => makeOVAOptions(response, ovaList))
                                .catch(error => console.log(error));
                            } else {
                                select.removeClass("d-none");
                                courses.val("");
                            }
                        });

                        adminForm.insertAfter(chooseOVAsTab.find(".title"));
                    } else {
                        await getOVAs(localStorage.getItem("course_id"))
                        .then(response => makeOVAOptions(response, ovaList))
                        .catch(error => console.log(error));
                    }
                }, 500);
            }
        }).catch(error => {
            statusBar.html(error.responseText);
            statusBar.addClass("bg-danger");
            statusBarAnimation(statusBar);
        });
    });
});

function login(user_data) {
    const url = "/login";
    return doRequest(url, user_data, "POST", true);
}

function getOVAsAdmin(option, select) {
    let url;
    if (option == "all") url = "all";
    else {
       const courseId = select.find("option:checked").val();
       url = `course/${courseId}`;
    }
    
    return doRequest("/ova/" + url, {}, "GET");
}

function getOVAs(course_id) {
    return doRequest(`/ova/course/${course_id}`, {}, "GET");
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