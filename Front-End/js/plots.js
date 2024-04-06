import { doRequest } from "./request.js";

$(document).ready(function () {
    $(".back-button").attr("href", localStorage.getItem("ova_link"));
    const update = $(".update");
    update.on("click", async function(e) {
        e.preventDefault();
        getData()
        .then(response => {
            const data = [
                {
                    x: Object.keys(JSON.parse(response)),
                    y: Object.values(JSON.parse(response)),
                    type: "bar"
                }
            ];
            Plotly.newPlot('plots', data);
        })
        .catch(error => console.log(error));
    });
});

function getData() {
    const url = "/plots";
    return doRequest(url, {}, "GET");
}