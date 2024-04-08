import { doRequest } from "./request.js";

$(document).ready(function () {
    $(".back-button").attr("href", localStorage.getItem("ova_link"));
    const plots = $(".plots");
    const update = $(".update");
    update.on("click", async function(e) {
        e.preventDefault();
        getData()
        .then(response => {
            for (let i = 0; i < response.length; i++) {
                const plot = $(`<div id="plot-${i}"></div>`);
                plots.append(plot);
                const data = [
                    {
                        x: Object.keys(JSON.parse(response[i])),
                        y: Object.values(JSON.parse(response[i])),
                        type: "bar"
                    }
                ];
                Plotly.newPlot(`plot-${i}`, data);
            }
        })
        .catch(error => console.log(error));
    });
});

function getData() {
    const url = "/plots";
    return doRequest(url, {}, "GET");
}