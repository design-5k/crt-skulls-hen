const FRICTION = .2;
const MOVE_SPEED = .08;
const COLOR_SPEED = 0.2;
const colours = [0x00FF2E, 0x00FFEC, 0x007CFF, 0x0800FF, 0x6C00FF];

export class Particle {
    constructor(pos, texture) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(0.12);
        this.pixelColor = pos.col;

        this.savedX = pos.x;
        this.savedY = pos.y;
        this.x = pos.x;
        this.y = pos.y;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.vx = 0;
        this.vy = 0;
        this.radius = 10;

        this.savedRgb = pos.col;
        this.rgb = 0x000000;
    }

    collide() {
        this.rgb = colours[Math.floor(Math.random()*4)];
    }

    draw() {
        this.rgb += (this.savedRgb - this.rgb) * COLOR_SPEED;

        this.x += (this.savedX - this.x) * MOVE_SPEED;
        this.y += (this.savedY - this.y) * MOVE_SPEED;

        this.vx *= FRICTION * getRandom(1,2);
        this.vy *= FRICTION * getRandom(1,2);

        this.x += this.vx;
        this.y += this.vy;

        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.tint = this.rgb;
    }

    setColor() {
        this.sprite.tint = this.pixelColor;
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}