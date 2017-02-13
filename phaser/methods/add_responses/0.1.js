export default function (fn = 'collide', optsArray) {
    _.each(optsArray, opts => {
        opts = _.defaults(opts, [
            this.player,
            this.platforms,
            _.noop,
            null,
            this,
        ]);
        this.game.physics.arcade[fn](...opts);
    });
}
