export default function (fn = 'image', optsArray) {
    if (fn === 'audio' && !this.audio) this.audio = {};
    this.game.load.crossOrigin = 'anonymous';
    _.each(optsArray, opts => {
        this.game.load[fn](...opts);
        if (fn === 'audio') this.audio[opts[0]] = true;
    });
}
