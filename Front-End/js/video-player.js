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
    player.seekTo(1);
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

var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        event.target.stopVideo()
        done = true;
    }
}