export default function (opts) {
    opts = _.defaults(opts, {
        upSpeed: -350,
        downSpeed: 500,
        leftSpeed: -150,
        rightSpeed: 150,
        stopFrame: 4,
    });

    //  Reset the players velocity (movement)
    if (this.isHit) return;
    this.player.body.velocity.x = 0;

    if (this.controller.left) {
        //  Move to the left
        this.player.body.velocity.x = opts.leftSpeed;
        this.player.animations.play('left');
    } else if (this.controller.right) {
        //  Move to the right
        this.player.body.velocity.x = opts.rightSpeed;
        this.player.animations.play('right');
    } else {
        //  Stand still
        this.player.animations.stop();
        this.player.frame = opts.stopFrame;
    }

    //  Allow the player to jump if they are touching the ground.
    if (this.player.canJump &&
        (this.controller.up) &&
        this.player.body.touching.down) {
        this.player.body.velocity.y = opts.upSpeed;
        _.invoke(opts.jumpSound, 'play');
    }

    //  Allow the player to fall fast if they are not touching the ground.
    if (this.controller.down && !this.player.body.touching.down) {
        this.player.body.velocity.y = opts.downSpeed;
    }
}

