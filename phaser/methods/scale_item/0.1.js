export default function (item, opts = {}) {
    opts = _.defaults(opts, {
        scale: [1, 1],
    });

    item.scale.setTo(...opts.scale);

    if (opts.body) {
        item.scale.setTo(...opts.body);
    }
}
