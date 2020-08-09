let stream, processed, context, temp, tempContext, viewWidth, viewHeight;

function init() {
    stream = document.getElementById('video');
    processed = document.getElementById('processed');
    context = processed.getContext('2d');

    temp = document.createElement('canvas');
    temp.setAttribute('width', viewWidth);
    temp.setAttribute('height', viewHeight);
    tempContext = temp.getContext('2d');

    stream.addEventListener('play', computeFrame);
}

function computeFrame() {
    tempContext.drawImage(stream, 0, 0, viewWidth, viewHeight);
    let frame = tempContext.getImageData(0, 0, viewWidth, viewHeight);

    //brightness
    let data = frame.data;
    //brightness level
    let level = Number(document.getElementById('brightness').value);
    console.log(level);
    for (var i=0; i<data.length; i+=4) {
        data[i] += level;       //r
        data[i + 1] += level;   //g
        data[i +  2] += level;  //b
    }

    context.putImageData(frame, 0, 0);
    //calls itself
    setTimeout(computeFrame, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    resize();
});

//resize canvas when viewport is resized
window.addEventListener('resize', () => {
    resize();
});

function resize() {
    viewWidth = window.innerWidth / 2;
    viewHeight = (viewWidth / 16) * 9;
    processed.setAttribute('width', viewWidth);
    processed.setAttribute('height', viewHeight);
    temp.setAttribute('width', viewWidth);
    temp.setAttribute('height', viewHeight);
};