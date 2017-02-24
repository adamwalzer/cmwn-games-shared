export default function (item, opts = {}) {
    opts = _.defaults(opts, {
        scale: [1, 1],
    });

    item.scale.setTo(...opts.scale);

    if (opts.body) {
        // defer here to prevent this.player.scale from overriding body size
        // we might want to find a better way to do this
        setTimeout(() => {
            item.body.width = opts.body[0] * opts.scale[0];
            item.body.height = opts.body[1] * opts.scale[1];
            item.body.offset.x = opts.body[2];
            item.body.offset.y = opts.body[3];
        }, 0);
    }
}
