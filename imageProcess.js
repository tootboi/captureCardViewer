let stream, ogCanvas, context, temp, tempContext, viewWidth, viewHeight, frame;

function init() {
    stream = document.getElementById('video');
    ogCanvas = document.getElementById('processed');
    context = ogCanvas.getContext('2d');

    temp = document.createElement('canvas');
    temp.setAttribute('width', viewWidth);
    temp.setAttribute('height', viewHeight);
    tempContext = temp.getContext('2d');

    stream.addEventListener('play', computeFrame);
}

function computeFrame() {
    tempContext.drawImage(stream, 0, 0, viewWidth, viewHeight);
    frame = tempContext.getImageData(0, 0, viewWidth, viewHeight);

    //brightness
    let data = frame.data;
    //brightness level
    let level = Number(document.getElementById('brightness').value);
    for (var i=0; i<data.length; i+=4) {
        data[i] += level;       //r
        data[i + 1] += level;   //g
        data[i +  2] += level;  //b
    }

    let divisor = 1;
    let offset = 0;
    let none = [[0, 0,  0],[0,  1, 0],[0, 0,  0]];
    let sharpen = [[0, -1,  0],[-1,  5, -1],[0, -1,  0]];
    let edgeDetect = [[0, 1, 0], [1, -4, 1], [0, 1, 0]];
    let emboss = [[-2, 1, 0], [-1, 1, 1], [0, 1, 2]];
    let blur = [[.1, .1, .1], [.1, .1, .1], [.1, .1, .1]];
    let antiAlias = [[0, 1,  0],[1,  2, 1],[0, 1,  0]];

    const userInput = document.getElementById('matrix').value;
    let matrix;
    switch (userInput) {
        case 'sharpen':
            matrix = [[0, -1,  0],[-1,  5, -1],[0, -1,  0]];
            break;
        case 'edgeDetect':
            matrix = [[0, 1, 0], [1, -4, 1], [0, 1, 0]];
            break;
        case 'emboss':
            matrix = [[-2, 1, 0], [-1, 1, 1], [0, 1, 2]];
            break;
        case 'blur':
            matrix = [[.1, .1, .1], [.1, .1, .1], [.1, .1, .1]];
            break;
    }
    
    if(userInput !== 'none') {
        frame = convolve(matrix, divisor, offset);
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
    viewWidth = window.innerWidth;
    viewHeight = (viewWidth / 16) * 9;
    ogCanvas.setAttribute('width', viewWidth);
    ogCanvas.setAttribute('height', viewHeight);
    temp.setAttribute('width', viewWidth);
    temp.setAttribute('height', viewHeight);
    video.setAttribute('width', viewWidth);
    video.setAttribute('height', viewHeight);
};

function convolve(matrix, divisor, offset) {
    let m = [].concat(matrix[0], matrix[1], matrix[2]);
    // if(!divisor) {
    //     divisor = m.reduce(function(a, b) {return a+b}) || 1;
    // }
    let olddata = frame;
    let oldpx = olddata.data;
    let newdata = context.createImageData(olddata);
    let newpx = newdata.data;
    let len = newpx.length;
    let res = 0;
    let w = frame.width;

    for (var i=0; i<len; i++) {
        if ((i+1) % 4 === 0) {
            newpx[i] = oldpx[i];
            continue;
        };
        res = 0;
        let these = [
            oldpx[i - w * 4 - 4] || oldpx[i],
            oldpx[i - w * 4]     || oldpx[i],
            oldpx[i - w * 4 + 4] || oldpx[i],
            oldpx[i - 4]         || oldpx[i],
            oldpx[i],
            oldpx[i + 4]         || oldpx[i],
            oldpx[i + w * 4 - 4] || oldpx[i],
            oldpx[i + w * 4]     || oldpx[i],
            oldpx[i + w * 4 + 4] || oldpx[i]
        ];
        for (var j=0; j < 9; j++) {
            res += these[j] * m[j];
        }
        res /= divisor;
        if(offset) {
            res += offset;
        }
        newpx[i] = res;
    }
    return newdata;
}