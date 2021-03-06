// As of skoash 1.1.0 this component can be found at skoash.Reveal
/* eslint-disable no-console */
console.warn('As of skoash 1.1.0 this component can be found at skoash.Reveal');
/* eslint-enable no-console */

import classNames from 'classnames';

class Reveal extends skoash.Component {
    constructor() {
        super();

        this.state = {
            openReveal: '',
            currentlyOpen: []
        };

        this.index = 0;
    }

    incomplete() {
        this.setState({
            openReveal: '',
            currentlyOpen: []
        });

        super.incomplete();
    }

    open(message) {
        var self = this;
        var currentlyOpen = this.props.openMultiple ?
            this.state.currentlyOpen.concat(message) : [message];

        self.setState({
            open: true,
            openReveal: message,
            currentlyOpen,
        });

        self.playAudio(message);

        if (self.props.completeOnOpen) {
            self.complete();
        } else {
            _.each(self.refs, (ref, key) => {
                if (ref && key === message) ref.complete();
            });
        }

        if (self.props.autoClose) {
            setTimeout(function () {
                self.close();
            }, 2000);
        }

        if (self.props.openTarget) {
            self.updateGameState({
                path: self.props.openTarget,
                data: {
                    open: '' + message,
                    close: false,
                }
            });
        }

        self.props.onOpen.call(self, message);
    }

    close(opts = {}) {
        var prevMessage;
        var currentlyOpen;
        var openReveal;
        var open;

        prevMessage = this.state.openReveal;
        currentlyOpen = this.state.currentlyOpen;
        currentlyOpen.splice(currentlyOpen.indexOf(prevMessage), 1);
        open = currentlyOpen.length > 0;
        openReveal = open ? currentlyOpen[currentlyOpen.length - 1] : '';

        this.setState({
            open,
            openReveal,
            currentlyOpen,
        });

        if (!opts.silent) this.playMedia('close-sound');

        this.props.onClose.call(this, prevMessage);

        if (typeof this.props.closeRespond === 'function') {
            this.props.closeRespond(prevMessage);
        }
    }

    start() {
        super.start();
        if (this.props.openOnStart != null) {
            this.open(this.props.openOnStart);
        } else if (this.props.start && typeof this.props.start === 'function') {
            this.props.start.call(this);
        } else {
            this.close({silent: true});
        }
    }

    playAudio(message) {
        var messages;

        message += '';

        this.playMedia('open-sound');

        messages = message.split(' ');
        messages.map(audio => {
            this.playMedia(audio);
            this.playMedia('asset-' + audio);
        });
    }

    renderAssets() {
        if (this.props.assets) {
            return this.props.assets.map((asset, key) => {
                var ref = asset.ref || asset.props['data-ref'] || 'asset-' + key;
                return (
                    <asset.type
                        {...asset.props}
                        data-ref={key}
                        ref={ref}
                        key={key}
                    />
                );
            });
        }

        return null;
    }

    renderList() {
        var list = this.props.list;

        return list.map((li, key) => {
            var ref = li.ref || li.props['data-ref'] || key;
            return (
                <li.type
                    {...li.props}
                    type="li"
                    className={this.getClass(li, key)}
                    data-ref={ref}
                    ref={ref}
                    key={key}
                />
            );
        });
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);

        if (props.openReveal != null && props.openReveal !== this.props.openReveal) {
            this.open(props.openReveal);
        }

        if (props.closeReveal !== this.props.closeReveal) {
            if (props.closeReveal === true) {
                this.close();
            } else if (Number.isInteger(props.closeReveal)) {
                for (let i = 0; i < props.closeReveal; i++) {
                    this.close();
                }
            }
        }
    }

    getClass(li, key) {
        var classes = '';

        if (li.props.className) classes = li.props.className;

        if (this.state.currentlyOpen.indexOf(key) !== -1 ||
            this.state.currentlyOpen.indexOf('' + key) !== -1 ||
            this.state.currentlyOpen.indexOf(li.props['data-ref']) !== -1 ||
            this.state.currentlyOpen.indexOf(li.ref) !== -1
        ) {
            classes = classNames(classes, 'OPEN');
        }

        return classes;
    }

    getClassNames() {
        var classes;
        var open = 'open-none';

        if (this.state.open) {
            open = '';
            this.state.currentlyOpen.forEach(ref => {
                open += 'open-' + ref;
            });
        }

        classes = classNames(
            'reveal',
            open,
            super.getClassNames()
        );

        return classes;
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                {this.renderAssets()}
                <div>
                    <ul>
                        {this.renderList()}
                    </ul>
                    <button className="close-reveal" onClick={this.close.bind(this)}></button>
                </div>
            </div>
        );
    }
}

Reveal.defaultProps = _.defaults({
    list: [
        <li></li>,
        <li></li>,
        <li></li>,
        <li></li>
    ],
    openMultiple: false,
    onOpen: _.noop,
    onClose: _.noop,
}, skoash.Component.defaultProps);

export default Reveal;
