$(document).ready(function() {
    const togglePassword = $(".toggle-password");
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

    loginButton.on("click", function(e) {
        e.preventDefault();
        const user_data = {
            RA: new String("20A.752355"),
            password: new String("Password123")
        };
        localStorage.setItem("user_data", JSON.stringify(user_data));
        window.location.href = "http://127.0.0.1:5500/html/index.html";
    });
});