$(document).ready(function () {
    const iframe = $("#iframe");
    const ova_link = localStorage.getItem("ova_link");
    iframe.attr("src", `./ovas/${ova_link}`);
    iframe.on("load", function() {
        const firstScript = $("#first-script");
        
        const ovaScript = $(`<script type="module"></script>`);
        ovaScript.attr("src", "../js/ova.js");
        ovaScript.insertAfter(firstScript);

        // const videoScript = $("<script></script>");
        // videoScript.attr("src", "../js/video-player.js");
    
        const iframeDoc = iframe.contents()[0];
        const frag = iframeDoc.createDocumentFragment();

        const videoScript = iframeDoc.createElement("script");
        videoScript.src = "../../js/video-player.js";
        videoScript.type = "text/javascript"
        frag.appendChild(videoScript);

        const element = iframeDoc.body;
        element.appendChild(frag)
    });
});