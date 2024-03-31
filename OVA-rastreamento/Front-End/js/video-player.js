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
    players.push({
        player: new YT.Player('player1', {
            videoId: 'fLN1zQOPT2E',
            events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
            }
        }),
        points: generatePoints(20)
    });
    players.push({
        player: new YT.Player('player2', {
            videoId: 's9MyPVujd7E',
            events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
            }
        }),
        points: generatePoints(20)
    });
    players.forEach(player => {
        
    });
}

function onPlayerReady(event) {
    const player = event.target;
    player.seekTo(0);
    const iframe = player.getIframe();
    const iframeId = iframe.dataset.playerlistPos;
    const playerData = players[iframeId];
    console.log(playerData);
    player.seekTo(0);
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
                console.log("Finished the video");
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