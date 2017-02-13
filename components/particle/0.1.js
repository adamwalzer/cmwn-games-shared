class Particle {
    constructor(particle) {
        this.x = particle.x;
        this.y = particle.y;
        this.velocityY = particle.velocityY;
        this.velocityX = particle.velocityX;
        this.size = particle.size;
        this.alpha = particle.alpha;
    }

    update(context, image, delta) {
        this.y += this.velocityY;
        this.x += this.velocityX;
        this.velocityY *= delta.vy;
        this.velocityX *= delta.vx;
        if (this.alpha < 0) this.alpha = 0;
        context.globalAlpha = this.alpha;
        context.save();
        context.translate(this.x, this.y);
        context.scale(this.size, this.size);
        context.drawImage(image, -image.width / 2, -image.height / 2);
        context.restore();
        this.alpha *= delta.alpha;
        this.size += delta.size;
    }
}

export default Particle;

