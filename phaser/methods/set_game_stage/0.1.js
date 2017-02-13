export default function (opts = {}) {
    opts = _.defaults(opts, {
        physics: Phaser.Physics.ARCADE,
        disableVisibilityChange: true,
        left: 0,
        top: 0,
        width: 2000,
        height: 600,
    });

    this.game.physics.startSystem(opts.physics);
    this.game.stage.disableVisibilityChange = opts.disableVisibilityChange;
    this.game.world.setBounds(opts.left, opts.top, opts.width, opts.height);
}
