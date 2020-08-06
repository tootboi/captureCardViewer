const video = document.getElementById('video');
const constraints = {audio: {sampleRate: 96000, echoCancellation: false, autoGainControl: false}, video: {aspectRatio: 16/9, resizeMode: 'none', frameRate: 30}}

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