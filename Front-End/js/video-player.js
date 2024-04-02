import { registerInteraction } from "./request.js";

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
                events: {
                    "onReady": onPlayerReady,
                    "onStateChange": onPlayerStateChange
                }
            }),
            points: generatePoints(20)
        });
    });
}

onYouTubeIframeAPIReady();

function onPlayerReady(event) {
    const player = event.target;
    player.seekTo(0);
    const iframe = player.getIframe();
    const iframeId = iframe.dataset.playerlistPos;
    const playerData = players[iframeId];
    const video_data = {
        ra: localStorage.getItem("ra"),
        
    }
    setInterval(function() {
        const ct = player.getCurrentTime();
        const d = player.getDuration();
        const perc = 100 * ct / d
        Object.keys(playerData.points).forEach(point => {
            if (perc >= point & !playerData.points[point]) {
                playerData.points[point] = true;
                console.log(`Watched ${point}% of the ${iframe.title} video`);
            }
            if (player.getPlayerState() == 0 & !playerData.points[100]) {
                playerData.points[100] = true;
                console.log(`Finished the ${iframe.title} video`);
            }
        });
    }, 500);
}

let done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        done = true;
        stopVideo(event);
    }
}

function stopVideo(event) {
    event.target.stopVideo();
}