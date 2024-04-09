$(document).ready(function () {
    const iframe = $("#iframe");
    iframe.on("load", function() {
        const iframeDocument = iframe.contents().find("body");
        console.log(iframeDocument);
    });
});