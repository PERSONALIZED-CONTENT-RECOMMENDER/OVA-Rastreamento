const PORT = 8000;
const HOST = "localhost";
const BASE_URL = `http://${HOST}:${PORT}`

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function generatePoints(x, video_id) {
    const perc_done = localStorage.getItem(`${video_id}_viewed`);
    const points = {};
    const n = 100 / x;
    for (let i = 1; i <= n; i++) {
        points[x * i] = x * i <= perc_done;
    }

    return points;
}

let players = [];

function onYouTubeIframeAPIReady() {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach(iframe => {
        const videoId = iframe.dataset.videoId
        if (localStorage.getItem(`${videoId}_viewed`) == null) {
            localStorage.setItem(`${videoId}_viewed`, 0);
        }
        players.push({
            player: new YT.Player(iframe.id, {
                videoId: videoId,
                events: {
                    "onReady": onPlayerReady
                }
            }),
            id: videoId,
            points: generatePoints(20, videoId)
        });
    });
}

function onPlayerReady(event) {
    const player = event.target;
    const iframe = player.getIframe();
    const iframeId = iframe.dataset.playerlistPos;
    const playerData = players[iframeId];
    player.seekTo(JSON.parse(localStorage.getItem(`${playerData.id}_viewed`)));
    setInterval(function() {
        const ct = player.getCurrentTime();
        const d = player.getDuration();
        const perc = 100 * ct / d
        Object.keys(playerData.points).forEach(point => {
            if (perc >= point & !playerData.points[point]) {
                playerData.points[point] = true;
                localStorage.setItem(`${playerData.id}_viewed`, ct);
                videoVisualization(`Watched ${point}% of the ${iframe.title} video`)
                .then(response => console.log("success"))
                .catch(error => console.log(error));
            }
            if (player.getPlayerState() == 0 & !playerData.points[100]) {
                playerData.points[100] = true;
                localStorage.setItem(`${playerData.id}_viewed`, ct);
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