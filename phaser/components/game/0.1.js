class Game {
    constructor(opts = {}) {
        var update;

        opts.preload = (opts.preload || _.noop).bind(this);
        opts.create = (opts.create || _.noop).bind(this);
        opts.update = (opts.update || _.noop).bind(this);

        update = (function () {
            if (!this.shouldUpdate) {
                setTimeout(() => {
                    this.shouldUpdate = true;
                    this.emitEvent({ ready: true });
                }, 100);
                return;
            }

            opts.update();
        }).bind(this);

        opts = _.defaults(opts, {
            width: 960,
            height: 540,
            renderer: Phaser.AUTO,
            parent: '',
            helpers: {},
            state: { preload: opts.preload, create: opts.create, update },
        });

        this.helpers = opts.helpers;
        this.opts = opts.opts;

        this.game = new Phaser.Game(opts.width, opts.height, opts.renderer, opts.parent, opts.state);

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
