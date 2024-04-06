const PORT = 8000;
const HOST = "localhost";
const BASE_URL = `http://${HOST}:${PORT}`

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function generatePoints(x) {
    const points = {};
    const n = 100 / x;
    for (let i = 1; i <= n; i++) {
        points[x * i] = false;
    }

    return points;
}

let players = [];

function onYouTubeIframeAPIReady() {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach(iframe => {
        const url = iframe.src;
        const urlSplitted = url.split("/")
        let videoId = urlSplitted[urlSplitted.length - 1];
        players.push({
            player: new YT.Player(iframe.id, {
                videoId: videoId,
                playerVars: { 'autoplay': 1, 'controls': 0 },
                events: {
                    "onReady": onPlayerReady
                }
            }),
            points: generatePoints(20)
        });
    });
}

function onPlayerReady(event) {
    const player = event.target;
    const iframe = player.getIframe();
    const iframeId = iframe.dataset.playerlistPos;
    const playerData = players[iframeId];
    setInterval(function() {
        const ct = player.getCurrentTime();
        const d = player.getDuration();
        const perc = 100 * ct / d
        Object.keys(playerData.points).forEach(point => {
            if (perc >= point & !playerData.points[point]) {
                playerData.points[point] = true;
                videoVisualization(`Watched ${point}% of the ${iframe.title} video`)
                .then(response => console.log("success"))
                .catch(error => console.log(error));
            }
            if (player.getPlayerState() == 0 & !playerData.points[100]) {
                playerData.points[100] = true;
                videoVisualization(`Watched 100% of the ${iframe.title} video`)
                .then(response => console.log("success"))
                .catch(error => console.log(error));
            }
        });
    }, 1000);
}

function videoVisualization(perc_watched, type="POST") {
    const data = {
        ra: localStorage.getItem("ra"),
        ova_id: localStorage.getItem("ova_id"),
        action: perc_watched
    };

    return new Promise((resolve, reject) => {
        $.ajax({
            type: type,
            url: BASE_URL + "/interaction/register",
            data: JSON.stringify([data]),
            dataType: "json",
            crossDomain: true,
            contentType: "application/json",
            headers: {
                "Access-Control-Allow-Origin":"http:"
            },
            success: (response) => resolve(response),
            error: (response) => reject(response)
        });
    });
}