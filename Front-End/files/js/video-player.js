// Basic configurations for the URL
const PORT = 8090;
const HOST = "172.168.30.3";
const BASE_URL = `http://${HOST}:${PORT}`;

// The lines below dynamically add the script for 
// the YouTube embed API in the OVA HTML
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Generate the checkpoints for the video watching progress
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

// The function is called when the API is ready
function onYouTubeIframeAPIReady() {
    const videoIframes = document.querySelectorAll(".ova_video");
    videoIframes.forEach(iframe => {
        // For each video in the OVA, a player is created with an ID
        // an API object and the checkpoints
        const videoId = iframe.dataset.videoId;
        if (localStorage.getItem(`${videoId}_viewed`) == null) {
            localStorage.setItem(`${videoId}_viewed`, 0);
        }
        // Set the data for each player
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

// This function is called when each player is ready
function onPlayerReady(event) {
    // Get the player data
    const player = event.target;
    const iframe = player.getIframe();
    const iframeId = iframe.dataset.playerlistPos;
    const playerData = players[iframeId];
    player.stopVideo();
    // For each second, the script will verify if the user reached
    // a new checkpoint
    setInterval(function() {
        const ct = player.getCurrentTime();
        const d = player.getDuration();
        const perc = 100 * ct / d;
        if (playerData.initial) {
            Object.keys(playerData.points).forEach(point => {
                if (perc >= point && !playerData.points[point]) {
                    playerData.points[point] = true;
                    localStorage.setItem(`${playerData.id}_viewed`, ct);
                    // The interaction registration is made, 
                    // identifying the percentage and the video
                    videoVisualization(`Watched ${point}% of the ${iframe.title} video`)
                    .then(response => console.log("success"))
                    .catch(error => console.log(error));
                }
                // This is especially for 100%, once the
                // video has ended, but it's equal to the registration above
                if (player.getPlayerState() == 0 && !playerData.points[100]) {
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

// This function is called when the video is paused, played, etc.
function onPlayerStateChange(event) {
    const player = event.target;
    const iframe = player.getIframe();
    const iframeId = iframe.dataset.playerlistPos;
    const playerData = players[iframeId];
    // This ensures that the video will start at 0
    if (event.data == YT.PlayerState.PLAYING && !playerData.initial) {
        player.mute();
        player.seekTo(0);
        player.unMute();
        playerData.initial = true;
    }
}

// The function to register the interaction
function videoVisualization(perc_watched, type="POST") {
    // Contains the ID of the student that is watching, the ID of the OVA
    // and the percentage watched
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
                "Access-Control-Allow-Origin": "http:"
            },
            success: (response) => resolve(response),
            error: (response) => reject(response)
        });
    });
}
