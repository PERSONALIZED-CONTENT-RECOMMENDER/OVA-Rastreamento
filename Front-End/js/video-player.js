// basic configurations for the url
const PORT = 8090;
const HOST = "localhost";
const BASE_URL = `http://${HOST}:${PORT}`

// the lines above add dinamically the script for 
// the youtube embed api in the ova html
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// generate the checkpoints for the video watching progress
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

// the function is called when the API is ready
function onYouTubeIframeAPIReady() {
    const videoIframes = document.querySelectorAll(".ova_video");
    videoIframes.forEach(iframe => {
        // for each video in the OVA, a player is created with an id
        // an API object and the checkpoints
        const videoId = iframe.dataset.videoId
        if (localStorage.getItem(`${videoId}_viewed`) == null) {
            localStorage.setItem(`${videoId}_viewed`, 0);
        }
        const player_data = {
            player: new YT.Player(iframe.id, {
                videoId: videoId,
                events: {
                    "onReady": onPlayerReady,
                    "onStateChange": onPlayerStateChange
                }
            }),
            id: videoId,
            points: generatePoints(20, videoId),
            initial: false
        };
        players.push(player_data);
    });
}

// this function is called when each player is ready
function onPlayerReady(event) {
    // get the player data
    const player = event.target;
    const iframe = player.getIframe();
    const iframeId = iframe.dataset.playerlistPos;
    const playerData = players[iframeId];
    player.stopVideo();
    // for each second, the script will verify if the user reached
    // a new checkpoint
    setInterval(function() {
        const ct = player.getCurrentTime();
        const d = player.getDuration();
        const perc = 100 * ct / d
        if (playerData.initial) {
            Object.keys(playerData.points).forEach(point => {
                if (perc >= point & !playerData.points[point]) {
                    playerData.points[point] = true;
                    localStorage.setItem(`${playerData.id}_viewed`, ct);
                    // the interaction registration is made, 
                    // identifying the percentage and the video
                    videoVisualization(`Watched ${point}% of the ${iframe.title} video`)
                    .then(response => console.log("success"))
                    .catch(error => console.log(error));
                }
                // this is especially for 100%, once the
                // video has ended, but its equal to the registration above
                if (player.getPlayerState() == 0 & !playerData.points[100]) {
                    playerData.points[100] = true;
                    localStorage.setItem(`${playerData.id}_viewed`, ct);
                    videoVisualization(`Watched 100% of the ${iframe.title} video`)
                    .then(response => console.log("success"))
                    .catch(error => console.log(error));
                }
            });
        } 
    }, 1000);
}

// this function is called when the video is paused, played, etc
function onPlayerStateChange(event) {
    const player = event.target;
    const iframe = player.getIframe();
    const iframeId = iframe.dataset.playerlistPos - 1;
    const playerData = players[iframeId];
    // this ensure that the video will start in 0
    if (event.data == YT.PlayerState.PLAYING && !playerData.initial) {
        player.mute();
        player.seekTo(0);
        player.unMute();
        playerData.initial = true
    }
}

// the function to make the registration of the interaction
function videoVisualization(perc_watched, type="POST") {
    // contains the id of the student that is watching, the id of the ova
    // and the percentede watched
    const data = {
        student_id: localStorage.getItem("student_id"),
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