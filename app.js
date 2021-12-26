import {Visual} from './visual.js';
import {MouseV} from './modules/mouse-velocity.js';

var _width = window.innerWidth;
var _height = window.innerHeight;

const app = new  PIXI.Application({
    width: _width,
    height: _height,
    resolution: devicePixelRatio,
    autoDensity: true,
    autoResize : true
});

let renderer = PIXI.autoDetectRenderer();
renderer.resize(_width, _height);
renderer.view.style.position = 'absolute';
document.getElementById('background-id').appendChild(app.view);

let visual = new Visual();

var imgUrl = 'img.png';
var bgUrl = 'bg_img.jpg';

const loader = PIXI.Loader.shared; 
loader.add('baseImg', imgUrl)
      .add('bgImage', bgUrl);
loader.load((loader, resources) => {
    const img = new PIXI.Sprite.from(resources.baseImg.texture);
    img.anchor.set(0.5, 0.5);
    img.height = _height;
    img.width = _width;
    img.x = _width/2;
    img.y = _height/2;
    app.stage.addChild(img);
    visual.show(bgUrl, _width, _height, app.stage, renderer.plugins.extract.canvas(renderer._lastObjectRendered));
    app.stage.removeChild(img);
});

//glitch filter
const colorMatrix = new PIXI.filters.ColorMatrixFilter();
colorMatrix.negative();
colorMatrix.alpha = 0;

//crt filter
const crtFilter = new PIXI.filters.CRTFilter({
    lineContrast: 0.6,
    lineWidth: 3,
    time: 1,
    vignetting: 0,
    vignettingBlur: 0.4,
    noise: 0,
});

//bloom filter
const bloomFilter = new PIXI.filters.AdvancedBloomFilter({
    threshold: .4,
    bloomScale: 2,
    brightness: 1,
    blur: 12,
});

app.stage.filters = [crtFilter, colorMatrix, bloomFilter];

//mouse data
var xPos, yPos, mouseSpeed;
var mouseV = new MouseV();
var previousEvent = false;

//mouse move function
window.onmousemove = function(e) {
    xPos = e.clientX;
    yPos = e.clientY;
    e.time = Date.now();
    mouseSpeed = mouseV.getMouseV(e, previousEvent);
    previousEvent = e;
}

window.addEventListener('resize', resize);

function resize() {
    visual.resize(window.innerWidth/_width, window.innerHeight/_height, window.innerWidth, window.innerHeight);
    _width = window.innerWidth;
    _height = window.innerHeight;

    app.renderer.resize(_height, _height);
    renderer.render(app.stage);
}

resize();

app.ticker.add(function(){
    visual.animate();
    crtFilter.time++;

    //glitch
    if(mouseSpeed > 10) {
        colorMatrix.alpha = 1;
        bloomFilter.bloomScale = 0;
    }
    else {
        colorMatrix.alpha = 0;
        bloomFilter.bloomScale = 1;
    }

    renderer.render(app.stage);
});