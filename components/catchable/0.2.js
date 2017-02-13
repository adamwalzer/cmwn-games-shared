import classNames from 'classnames';

class Catchable extends skoash.Component {
    constructor(props) {
        super(props);
        this.state = {
            catchable: false
        };
        this.reset = this.reset.bind(this);
    }

    setState(opts, cb) {
        super.setState(opts, cb);
    }

    bootstrap() {
        super.bootstrap();
    }

    markCaught() {
        if (!this.state.ready) return;
        this.catchable = false;
        this.setState({catchable: false});
        this.props.onCaught.call(this);
    }

    markCatchable() {
        this.DOMNode = this.DOMNode || ReactDOM.findDOMNode(this);
        if (this.state.catchable && this.catchable) return;
        this.catchable = true;
        this.setState({
            catchable: true,
        });
    }

    canCatch() {
        return !this.props.disabled && this.catchable;
    }

    getClassNames() {
        return classNames('catchable', {
            CAUGHT: !this.state.catchable
        }, super.getClassNames());
    }

    reset() {
        if (this.state.ready && !this.props.disabled && this.props.reCatchable) {
            this.catchable = true;
            this.setState({catchable: true});
        }
    }
}

Catchable.defaultProps = _.defaults({
    disabled: false,
    isCorrect: true,
    reCatchable: true,
    onCaught: _.noop,
    type: 'li',
}, skoash.Component.defaultProps);

export default Catchable;
