$(document).ready(function () {
    const iframe = $("#iframe");
    const ova_link = localStorage.getItem("ova_link");
    iframe.attr("src", `./ovas/${ova_link}`);
    iframe.on("load", function() {
        const firstScript = $("script")[0];
        
        const videoScript = $("<script></script>");
        videoScript.attr("src", "../js/video-player.js");
        videoScript.insertAfter(firstScript);

        const ovaScript = $(`<script type="module"></script>`);
        ovaScript.attr("src", "../js/ova.js");
        ovaScript.insertAfter(firstScript);
    });
});