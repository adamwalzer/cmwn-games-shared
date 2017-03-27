export default function (groupOpts = {}, optsArray = []) {
    groupOpts.defaultOpts = _.defaults(groupOpts.defaultOpts, {
        alpha: 1,
        scale: [1, 1],
        left: 0,
        top: 0,
        image: 'ground',
        immovable: true,
        bounceX: 1,
        bounceY: 1,
        gravityX: 0,
        gravityY: 0,
        collideWorldBounds: true,
        checkCollisionUp: true,
        checkCollisionDown: true,
        checkCollisionRight: true,
        checkCollisionLeft: true,
        angle: 0,
        anchor: [0, 0],
    });

    groupOpts = _.defaults(groupOpts, {
        enableBody: true,
        group: 'platforms'
    });

    if (!this[groupOpts.group] || this[groupOpts.group].game !== this.game) {
        // create the group we will be adding the items to
        this[groupOpts.group] = this.game.add.group();
        // enable physics for any object that is created in this group
        this[groupOpts.group].enableBody = groupOpts.enableBody;
    }

    _.each(optsArray, options => {
        let opts = _.defaults({}, options, groupOpts.defaultOpts);
        let item;

        this[groupOpts.group].game = this.game;
        item = this[groupOpts.group].create(opts.left, opts.top, opts.image);

        item.originalImage = opts.image;
        item.alpha = opts.alpha;
        item.scale.setTo(...opts.scale);
        if (opts.crop) {
            item.crop(new Phaser.Rectangle(...opts.crop));
        }
        item.angle = opts.angle;
        item.anchor.setTo(...opts.anchor);
        item.frame = opts.frame;

        if (groupOpts.enableBody) {
            item.body.immovable = opts.immovable;
            item.body.collideWorldBounds = opts.collideWorldBounds;
            item.body.bounce.x = opts.bounceX;
            item.body.bounce.y = opts.bounceY;
            item.body.gravity.x = opts.gravityX;
            item.body.gravity.y = opts.gravityY;
            item.body.checkCollision.up = opts.checkCollisionUp;
            item.body.checkCollision.down = opts.checkCollisionDown;
            item.body.checkCollision.right = opts.checkCollisionRight;
            item.body.checkCollision.left = opts.checkCollisionLeft;

            if (opts.body) {
                item.body.setSize(...opts.body);
            }
        }
    });
}
