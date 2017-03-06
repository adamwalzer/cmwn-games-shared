class Game {
    constructor(opts = {}) {
        opts = _.defaults(opts, {
            width: 960,
            height: 540,
            renderer: Phaser.AUTO,
            parent: '',
            helpers: {},
        });

        this.helpers = opts.helpers;
        this.opts = opts.opts || {};

        this.game = new Phaser.Game(opts.width, opts.height, opts.renderer, opts.parent);

        _.each(opts.states, (state, stateName) => {
            _.each(state, (func, funcName) => {
                state[funcName] = (func || _.noop).bind(this);
            });
            this.game.state.add(stateName, state);
        });

        this.game.state.start('default');

        this.attachEvents();
    }

    attachEvents() {
        window.addEventListener('skoash-event', (e) => {
            switch (e.name) {
                case 'controller-update':
                    this.controller = e.data.controller;
                    break;
                case 'data-update':
                    this.data = _.defaults(e.data.data, this.data);
                    break;
                case 'state-update':
                    console.log(e.data.data);
                    this.game.state.start(e.data.data || 'default');
                    break;
                case 'pause':
                    this.game.paused = true;
                    break;
                case 'resume':
                    this.game.paused = false;
                    break;
            }
        }, false);

        document.domain = 'changemyworldnow.com';
    }

    emitEvent(opts) {
        var e = new Event('game-event');
        _.each(opts, (v, k) => {
            e[k] = v;
        });
        if (window.frameElement) window.frameElement.dispatchEvent(e);
    }
}

export default Game;
