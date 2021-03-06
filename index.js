const video = document.getElementById('video');
const constraints = {audio: {sampleRate: 96000, echoCancellation: false, autoGainControl: false}, video: {aspectRatio: 16/9, resizeMode: 'none', frameRate: 30}}

screenSelect();

navigator.mediaDevices.getUserMedia(constraints)
    .then((mediaStream) => {
        // console.log(mediaStream.getTracks()[0].getSettings());
        // console.log(mediaStream.getTracks()[1].getSettings());

        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
            video.play();
          };
    })
    .catch(function(err) { console.log(err.name + ": " + err.message); });

function showMenu() {
    document.getElementById('menu').style.opacity = 1;
}

function hideMenu() {
    document.getElementById('menu').style.opacity = 0;
}

function adjustVolume() {
    const sliderVal = document.getElementById('range').value;
    video.volume = sliderVal;
}

var timeout;
document.onmousemove = function(){
    document.getElementById('menu').style.opacity = 1;
    document.getElementsByClassName('container')[0].style.cursor = 'auto';
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        document.getElementById('menu').style.opacity = 0;
        document.getElementsByClassName('container')[0].style.cursor = 'none';
    }, 3000);
}

function screenSelect() {
    const userInput = document.getElementById('screen').value;
    switch(userInput) {
        case 'Both':
            document.getElementById('canvasWrapper').style.display = 'flex';
            document.getElementById('videoWrapper').style.display = 'flex';
            break;
        case 'Original':
            document.getElementById('canvasWrapper').style.display = 'none';
            document.getElementById('videoWrapper').style.display = 'contents';
            break;
        case 'Processed':
            document.getElementById('canvasWrapper').style.display = 'contents';
            document.getElementById('videoWrapper').style.display = 'none';
            break;
    }
}