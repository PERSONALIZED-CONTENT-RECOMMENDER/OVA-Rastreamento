$(document).ready(function () {
    // get dinamically the iframe object from the DOM
    const iframe = $("#iframe");
    // get the link of the ova selected by the user
    const ova_link = localStorage.getItem("ova_link");
    // define the source of the iframe
    iframe.attr("src", `./ovas/${ova_link}`);
    // this function excecutes when the iframe load is complete
    iframe.on("load", function() {
        const firstScript = $("#first-script");
        
        /*
            dinamically adds the script of the detection of the interactions
            at the bottom of the iframe script 
        */
        if ($("#ova-script") == undefined) {
            const ovaScript = $(`<script id="ova-script" type="module"></script>`);
            ovaScript.attr("src", "../js/ova.js");
            ovaScript.insertAfter(firstScript);
        }

        // const videoScript = $("<script></script>");
        // videoScript.attr("src", "../js/video-player.js");
    
        /*
            the lines below add dinamically the script of the Youtube embed API
            inside the iframe content to detect the interactions made with the videos
        */
        const iframeDoc = iframe.contents()[0];
        const frag = iframeDoc.createDocumentFragment();

        const body = iframeDoc.body;

        if (body.querySelector("#video-script") == undefined) {
            const videoScript = iframeDoc.createElement("script");
            videoScript.src = "../../js/video-player.js";
            videoScript.id = "video-script";
            videoScript.type = "text/javascript";
            frag.appendChild(videoScript);

            body.appendChild(frag);
        }
    });
});