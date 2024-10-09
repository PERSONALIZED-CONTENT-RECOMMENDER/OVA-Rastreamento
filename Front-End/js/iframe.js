$(document).ready(function () {
    // get dinamically the iframe object from the DOM
    const iframe = $("#iframe");
    // get the link of the ova selected by the user
    const ova_link = localStorage.getItem("ova_link");
    // define the source of the iframe
    iframe.attr("src", `./ovas/${ova_link}`);
    // this function excecutes when the iframe load is complete
    iframe.on("load", function() {
        const contentWindow = iframe.get(0).contentWindow;
        const iframeDoc = iframe.contents()[0];
        const frag = iframeDoc.createDocumentFragment();

        const body = iframeDoc.body;
        
        /*
            dinamically adds the script of the detection of the interactions
            at the bottom of the ova html
        */
        if (body.querySelector("#ova-script") == undefined) {
            const ovaScript = iframeDoc.createElement("script");
            ovaScript.src = "../../js/ova.js";
            ovaScript.id = "ova-script";
            ovaScript.type = "module";
            frag.appendChild(ovaScript);
        }
    
        /*
            the lines below add dinamically the script of the Youtube embed API
            inside the iframe content to detect the interactions made with the videos
        */

        if (body.querySelector("#video-script") == undefined) {
            const videoScript = iframeDoc.createElement("script");
            videoScript.src = "../../js/video-player.js";
            videoScript.id = "video-script";
            videoScript.type = "text/javascript";
            frag.appendChild(videoScript);

            body.appendChild(frag);
        }

        $(contentWindow).on("scroll", function () {
            const s = $(contentWindow).scrollTop(),
                d = $(iframeDoc).height(),
                c = $(contentWindow).height();
    
            const scrollPercent = (s / (d - c)) * 100;    
            
            $("#progressbar").attr('value', scrollPercent);
            // update the progress bar
           
        });
    });

    // get the DOM elements
    const dropdown = $(".dropdown");
    dropdown.css({"top": "-600px"});
    const dropdownButton = $(".dropdown-button");

    /*
    when the dropdown button is clicked, shows all the sections, the button
    to logout and the button to the student plot page
    */
    dropdownButton.on("click", function() {
        if (!dropdownButton.hasClass("bi-x-lg")) {
            dropdown.removeClass("z-n1").addClass("z-1");
            dropdown.animate({
                top: "50px"
            }, 250);
            dropdownButton.addClass("bi-x-lg");
        } else {
            dropdown.animate({
                top: "-600px"
            }, 250);
            dropdownButton.removeClass("bi-x-lg");
        }
    });
});

/*
the function to generate the scrollpoints, given a minimum read time
and the number of the points
*/
function generateScrollPoints(readTime, n_points) {
    let points = [];
    const perc = 100 / n_points;
    const perc_time = readTime / n_points;
    const alreadyScrolled = JSON.parse(localStorage.getItem("perc_scrolled"));
    for (let i = 1; i <= n_points; i++) {
        /*
        the percentage of the point, the minimum time and 
        if the student already achieved that point
        */
        points.push({
            perc: perc * i,
            time: perc_time * i,
            status: perc * i <= alreadyScrolled
        });
    }

    return points;
}