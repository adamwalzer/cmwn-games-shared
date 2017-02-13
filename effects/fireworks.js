// code taken from http://codepen.io/haidang/pen/eBoqyw

class Fireworks {
    constructor(node, opts) {
        let canvas = document.createElement('CANVAS');
        canvas.width = node.offsetWidth;
        canvas.height = node.offsetHeight;
        let ctx = canvas.getContext('2d');
        let pat = '#000';

        if (opts.backgroundImage) {
            let tempCanvas = document.createElement('canvas');
            let tCtx = tempCanvas.getContext('2d');

            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;

            tCtx.drawImage(
                opts.backgroundImage,
                0,
                0,
                opts.backgroundImage.naturalWidth,
                opts.backgroundImage.naturalHeight,
                0,
                0,
                tempCanvas.width,
                tempCanvas.height
            );

            pat = ctx.createPattern(tempCanvas, 'repeat');
        } else if (opts.backgroundColor) {
            pat = opts.backgroundColor;
        }

        // resize
        window.addEventListener('resize', function () {
            canvas.width = node.offsetWidth;
            canvas.height = node.offsetHeight;
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = pat;
            ctx.fill();
        });

        node.appendChild(canvas);

        // init
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = pat;
        ctx.fill();
        // objects
        let listFire = [];
        let listFirework = [];
        let fireNumber = 10;
        let center = { x: canvas.width / 2, y: canvas.height / 2 };
        let range = 100;
        for (let i = 0; i < fireNumber; i++) {
            let fire = {
                x: Math.random() * range / 2 - range / 4 + center.x,
                y: Math.random() * range * 2 + canvas.height,
                size: Math.random() + 4.5,
                fill: '#fd1',
                vx: Math.random() - 0.5,
                vy: -(Math.random() + 4),
                ax: Math.random() * 0.02 - 0.01,
                far: Math.random() * range + (center.y - range)
            };
            fire.base = {
                x: fire.x,
                y: fire.y,
                vx: fire.vx
            };

            listFire.push(fire);
        }

        this.loop = this.loop.bind(this, opts, pat, canvas, ctx, listFire, listFirework, fireNumber, range);

        this.loop();

        this.node = node;
        this.canvas = canvas;
    }

    loop(opts, pat, canvas, ctx, listFire, listFirework, fireNumber, range) {
        if (this.destroyed) return;
        requestAnimationFrame(this.loop);
        this.update(opts, listFire, listFirework, fireNumber, range);
        this.draw(opts, pat, canvas, ctx, listFire, listFirework);
    }

    randColor() {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    update(opts, listFire, listFirework, fireNumber, range) {
        for (let i = 0; i < listFire.length; i++) {
            let fire = listFire[i];

            if (fire.y <= fire.far) {
                // case add firework
                let color = this.randColor();
                for (let j = 0; j < fireNumber * 5; j++) {
                    let firework = {
                        x: fire.x,
                        y: fire.y,
                        size: Math.random() + 4.5,
                        fill: color,
                        vx: Math.random() * 15 - 7.5,
                        vy: Math.random() * -15 + 4.5,
                        ay: 0.05,
                        alpha: 1,
                        life: Math.round(Math.random() * range / 2) + range / 2
                    };
                    firework.base = {
                        life: firework.life,
                        size: firework.size
                    };
                    listFirework.push(firework);
                }
                // reset
                fire.y = fire.base.y;
                fire.x = fire.base.x;
                fire.vx = fire.base.vx;
                fire.ax = Math.random() * 0.02 - 0.01;
            }

            fire.x += fire.vx;
            fire.y += fire.vy;
            fire.vx += fire.ax;
        }

        for (let i = listFirework.length - 1; i >= 0; i--) {
            let firework = listFirework[i];
            if (firework) {
                firework.x += firework.vx;
                firework.y += firework.vy;
                firework.vy += firework.ay;
                firework.alpha = firework.life / firework.base.life;
                firework.size = firework.alpha * firework.base.size;
                firework.alpha = firework.alpha > 0.6 ? 1 : firework.alpha;

                firework.life--;
                if (firework.life <= 0) {
                    listFirework.splice(i, 1);
                }
            }
        }
    }

    draw(opts, pat, canvas, ctx, listFire, listFirework) {
        // clear
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.18;
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = pat;
        ctx.fill();

        // re-draw
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 1;
        for (let i = 0; i < listFire.length; i++) {
            let fire = listFire[i];
            ctx.beginPath();
            ctx.arc(fire.x, fire.y, fire.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = fire.fill;
            ctx.fill();
        }

        for (let i = 0; i < listFirework.length; i++) {
            let firework = listFirework[i];
            ctx.globalAlpha = firework.alpha;
            ctx.beginPath();
            ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = firework.fill;
            ctx.fill();
        }
    }

    destroy() {
        this.destroyed = true;
        this.node.removeChild(this.canvas);
    }
}

export default function (node, opts) {
    return new Fireworks(node, opts);
}
