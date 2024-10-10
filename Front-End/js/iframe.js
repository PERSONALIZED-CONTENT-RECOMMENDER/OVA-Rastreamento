$(document).ready(function () {
    // Dynamically retrieve the iframe object from the DOM
    const iframe = $("#iframe");
    // Get the link of the OVA selected by the user
    const ova_link = localStorage.getItem("ova_link");
    // Set the source of the iframe
    iframe.attr("src", `./ovas/${ova_link}`);
    // This function executes when the iframe load is complete
    iframe.on("load", function() {
        const contentWindow = iframe.get(0).contentWindow;
        const iframeDoc = iframe.contents()[0];
        const frag = iframeDoc.createDocumentFragment();

        const body = iframeDoc.body;
        
        /*
            Dynamically adds the script for detecting interactions
            at the bottom of the OVA HTML
        */
        if (body.querySelector("#ova-script") == undefined) {
            const ovaScript = iframeDoc.createElement("script");
            ovaScript.src = "../../js/ova.js";
            ovaScript.id = "ova-script";
            ovaScript.type = "module";
            frag.appendChild(ovaScript);
        }
    
        /*
            The lines below dynamically add the script for the YouTube embed API
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

        // Attach a scroll event listener to the content window
        $(contentWindow).on("scroll", function () {
            const s = $(contentWindow).scrollTop(),
                d = $(iframeDoc).height(),
                c = $(contentWindow).height();
    
            // Calculate scroll percentage
            const scrollPercent = (s / (d - c)) * 100;    
            
            // Update the progress bar
            $("#progressbar").attr('value', scrollPercent);
        });
    });

    // Get the DOM elements for the dropdown
    const dropdown = $(".dropdown");
    dropdown.css({"top": "-600px"});
    const dropdownButton = $(".dropdown-button");

    /*
    When the dropdown button is clicked, shows the logout button
    and the button to the student plot page
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
The function to generate the scroll points, given a minimum read time
and the number of points
*/
function generateScrollPoints(readTime, n_points) {
    let points = [];
    const perc = 100 / n_points; // Percentage for each point
    const perc_time = readTime / n_points; // Time for each point
    const alreadyScrolled = JSON.parse(localStorage.getItem("perc_scrolled")); // Get already scrolled percentage

    for (let i = 1; i <= n_points; i++) {
        /*
        The percentage of the point, the minimum time, and 
        whether the student has already achieved that point
        */
        points.push({
            perc: perc * i,
            time: perc_time * i,
            status: perc * i <= alreadyScrolled
        });
    }

    return points; // Return the generated points
}
