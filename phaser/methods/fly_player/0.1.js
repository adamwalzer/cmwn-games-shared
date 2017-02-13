export default function (opts) {
    opts = _.defaults(opts, {
        upSpeed: -350,
        rightSpeed: 150,
        gravityY: 300,
        stopFrame: 0,
    });

    //  Reset the players velocity (movement)
    this.player.body.velocity.x = opts.rightSpeed;
    this.player.animations.play('right');

    //  fly if up or space are being pushed
    if (this.controller.up) {
        this.player.body.velocity.y = opts.upSpeed;
        if (!this.player.body.gravity.y) {
            this.player.body.gravity.y = opts.gravityY;
        }
    }
}
