import classNames from 'classnames';

const BALL = 'ball';

class Cannon extends skoash.Component {
    constructor() {
        super();

        this.fire = this.fire.bind(this);
        this.reload = this.reload.bind(this);
    }

    fire() {
        this.setState({
            fire: true,
            reload: false
        });
    }

    reload() {
        this.setState({
            fire: false,
            reload: true
        });

        if (typeof this.props.onReload === 'function') {
            this.props.onReload.call(this);
        }
    }

    getClassNames() {
        return classNames('cannon', {
            FIRE: this.state.fire,
            RELOAD: this.state.reload
        }, super.getClassNames());
    }

    renderBall() {
        return (
            <this.props.ball.type
                {...this.props.ball.props}
                className={BALL}
                ref={BALL}
                onTransitionEnd={this.reload}
            />
        );
    }

    render() {
        return (
            <div className={this.getClassNames()} onClick={this.fire}>
                {this.renderBall()}
            </div>
        );
    }
}

export default Cannon;
