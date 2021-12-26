import {Particle} from './particle.js';
import {Pixels} from './pixels.js';

export class Visual {
    constructor () {
        this.texture = PIXI.Texture.from('particle.png');

        this.particles = [];

        this.mouse = {
            x: 0,
            y: 0,
            radius: 100,
        };

        this.glitchFilter = new PIXI.filters.RGBSplitFilter([3,0], [0,0], [0,0]);

        this.particleCont = null;
        this.bgImg = null;

        document.addEventListener('pointermove', this.onMove.bind(this), false);
    }

    show(bgUrl, stageWidth, stageHeight, stage, sourceCanvas) {

        this.mouse.radius = stageWidth / 6;
        
        let pixels = new Pixels();
        let pos = pixels.dotPos(6, stageWidth, stageHeight, sourceCanvas);

        this.particleCont = new PIXI.ParticleContainer(
            pos.length,
            {
                vertices: false, 
                position: true, 
                rotation: false, 
                scale: true, 
                uvs: false, 
                tint: true,
                autoResize: true
            }
        );

        //this.particleCont.pivot = [0.5, 0.5];

        //bg glitch
        this.bgImg = new PIXI.Sprite.from(bgUrl);
        this.bgImg.anchor.set(0.5, 0.5);
        this.bgImg.height = stageHeight;
        this.bgImg.width = stageWidth;
        this.bgImg.x = stageWidth/2;
        this.bgImg.y = stageHeight/2;
        this.bgImg.zIndex = -1;
        this.bgImg.filters = [this.glitchFilter];
        stage.addChild(this.bgImg);

        if (this.particleCont) {
            stage.removeChild(this.particleCont);
        }

        stage.addChild(this.particleCont);

        this.particles = [];
        for(let i = 0; i < pos.length; i++) {
                const item = new Particle(pos[i], this.texture);
                this.particleCont.addChild(item.sprite);
                this.particles.push(item);
                item.setColor();
        }
    }

    animate() {
        for(let i = 0; i < this.particles.length; i++) {
            const item = this.particles[i];
            const dx = this.mouse.x - item.x;
            const dy = this.mouse.y - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = item.radius + this.mouse.radius*getRandom(0.8, 1);

            if(dist < minDist) {
                const angle = Math.atan2(dy, dx);
                const tx = item.x + Math.cos(angle) * minDist;
                const ty = item.y + Math.sign(angle) * minDist;
                const ax = tx - this.mouse.x;
                const ay = ty - this.mouse.y;
                item.vx -= ax*getRandom(0.6, 1);
                item.vy -= ay*getRandom(0.6, 1);
                item.collide();
            }

            item.draw();
        }

        this.glitchFilter.red = [Math.random() * 10, 0];
    }

    onMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    resize(width, height, x, y) {
        this.mouse.radius *= width;

        if(this.particleCont) 
            this.particleCont.scale.set(this.particleCont.scale.x*width, this.particleCont.scale.y*height);

        if(this.bgImg) {
            this.bgImg.width *= width;
            this.bgImg.height *= height;
            this.bgImg.x = x/2;
            this.bgImg.y = y/2;
        }
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}