import scaleItem from 'shared/phaser/methods/scale_item/0.1';

export default function (opts = {}) {
    opts = _.defaults(opts, {
        left: 32,
        top: 500,
        image: 'dude',
        bounceX: 0,
        bounceY: 0.2,
        gravityX: 0,
        gravityY: 300,
        collideWorldBounds: true,
        checkCollisionUp: true,
        checkCollisionDown: true,
        checkCollisionRight: true,
        checkCollisionLeft: true,
        leftFrames: [0, 1, 2, 3],
        leftFrameRate: 10,
        leftLoop: true,
        rightFrames: [5, 6, 7, 8],
        rightFrameRate: 10,
        rightLoop: true,
        scale: [1, 1],
        anchor: [.5, .5],
    });

    // The player and its settings
    this.player = this.game.add.sprite(opts.left, opts.top, opts.image);

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.anchor.setTo(...opts.anchor);
    scaleItem(this.player, opts);
    this.player.body.bounce.x = opts.bounceX;
    this.player.body.bounce.y = opts.bounceY;
    this.player.body.gravity.x = opts.gravityX;
    this.player.body.gravity.y = opts.gravityY;
    this.player.body.collideWorldBounds = opts.collideWorldBounds;
    this.player.body.checkCollision.up = opts.checkCollisionUp;
    this.player.body.checkCollision.down = opts.checkCollisionDown;
    this.player.body.checkCollision.right = opts.checkCollisionRight;
    this.player.body.checkCollision.left = opts.checkCollisionLeft;

    if (!opts.body) {
        opts.body = [this.player.body.width, this.player.body.height, 0, 0];
    }

    this.player.body.setSize(...opts.body);

    if (opts.onWorldBounds) {
        this.player.body.onWorldBounds = new Phaser.Signal();
        this.player.body.onWorldBounds.add(opts.onWorldBounds);
    }

    //  Our two animations, walking left and right.
    this.player.animations.add('left', opts.leftFrames, opts.leftFrameRate, opts.leftLoop);
    this.player.animations.add('right', opts.rightFrames, opts.rightFrameRate, opts.rightLoop);
}
