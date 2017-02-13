import classNames from 'classnames';

class Catchable extends skoash.Component {
    constructor(props) {
        super(props);
        this.state = {
            canCatch: true
        };
        this.reset = this.reset.bind(this);
    }

    setState(opts, cb) {
        super.setState(opts, cb);
    }

    bootstrap() {
        super.bootstrap();
        this.DOMNode = ReactDOM.findDOMNode(this);
    }

    markCaught() {
        if (!this.state.ready) return;
        this.setState({canCatch: false});
        this.props.onCaught.call(this);
    }

    canCatch() {
        return !this.props.disabled && this.state.canCatch;
    }

    getClassNames() {
        return classNames('catchable', {
            CAUGHT: !this.state.canCatch
        }, super.getClassNames());
    }

    reset() {
        if (this.state.ready && !this.props.disabled && this.props.reCatchable) {
            this.setState({canCatch: true});
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
