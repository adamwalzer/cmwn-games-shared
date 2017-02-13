import classNames from 'classnames';

class Cannon extends skoash.Component {
    constructor() {
        super();

        this.state = {
            classes: {}
        };

        this.fire = this.fire.bind(this);
        this.reload = this.reload.bind(this);
    }

    bootstrap() {
        var list;

        super.bootstrap();

        list = this.refs.bin ? this.refs.bin.get(this.props.showNum + 1) : this.props.list;

        this.setState({
            list
        });
    }

    start() {
        super.start();
        this.next();
    }

    next() {
        var classes;
        var list;
        classes = this.state.classes;
        list = this.state.list;
        if (this.props.reverseReload) {
            list = this.refs.bin.get(1).concat(list);
            list.pop();
        } else {
            list = list.concat(this.refs.bin.get(1));
            list.shift();
        }
        classes[this.state.list.length - 1] = 'LOADED';
        this.enabled = true;

        this.setState({
            classes,
            list
        });
    }

    fire() {
        var list = this.state.list || this.props.list || {};

        this.setState({
            fire: true,
            reload: false
        }, () => {
            setTimeout(() => {
                this.reload();
                this.next();
            }, this.props.reloadTime);
        });

        setTimeout(() => {
            this.updateGameState({
                path: this.props.dataTarget,
                data: {
                    play: 'fire',
                    fired: list[this.state.list.length - 1],
                }
            });
        }, this.props.dataDelay);

        this.props.onFire.call(this);
    }

    reload() {
        this.setState({
            fire: false,
            reload: true
        });

        this.updateGameState({
            path: this.props.dataTarget,
            data: {
                play: null,
                fired: null
            }
        });

        this.props.onReload.call(this);
    }

    getClassNames() {
        return classNames('cannon', {
            FIRE: this.state.fire,
            RELOAD: this.state.reload
        }, super.getClassNames());
    }

    getClass(key, li) {
        return classNames(
            'ammo',
            li.props.className,
            this.state.classes[key]
        );
    }

    renderBin() {
        if (!this.props.bin) return null;

        return (
            <this.props.bin.type
                {...this.props.bin.props}
                ref="bin"
            />
        );
    }

    renderAmmo() {
        var list = this.state.list || this.props.list;
        return list.map((li, key) => {
            var ref;
            ref = li.ref || li.props['data-ref'] || key;
            return (
                <li.type
                    {...li.props}
                    ref={ref}
                    data-ref={ref}
                    key={key}
                    className={this.getClass(key, li)}
                />
            );
        });
    }

    renderLaunchButton() {
        if (!this.props.launchButton) return;

        return (
            <div className="launch-button" onClick={this.fire} />
        );
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                {this.renderBin()}
                <div className="ammo-container" />
                {this.renderAmmo()}
                {this.renderLaunchButton()}
            </div>
        );
    }
}

Cannon.defaultProps = _.defaults({
    showNum: 3,
    reverseReload: false,
    list: [
        <li></li>,
        <li></li>,
        <li></li>,
        <li></li>
    ],
    dataTarget: 'game',
    dataDelay: 0,
    onReload: _.noop,
    onFire: _.noop,
}, skoash.Component.defaultProps);

export default Cannon;
