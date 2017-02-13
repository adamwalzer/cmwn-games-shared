import classNames from 'classnames';

class Target extends skoash.Component {
    constructor() {
        super();
    }

    start() {
        super.start();
        this.setTarget();
    }

    onChange(attempt) {
        if (this.state.target) {
            if (this.state.target === attempt) {
                this.onCorrect(attempt);
            } else {
                this.onIncorrect(attempt);
            }
        } else if (this.props.allCorrect) {
            this.onCorrect(attempt);
        }
    }

    onCorrect() {
        this.playMedia('correct');
        this.playMedia('correct-sound');

        this.updateState(true);
    }

    onIncorrect() {
        this.playMedia('incorrect');
        this.playMedia('incorrect-sound');

        this.updateState(false);
    }

    updateState(correct) {
        if (this.props.dataTarget) {
            this.updateGameState({
                path: this.props.dataTarget,
                data: {
                    correct
                }
            });
        }

        this.props.onUpdateState.call(this, correct);
    }

    setTarget(idx = 0) {
        var amount;

        if (this.props.loop) idx = idx % this.props.targets.length;
        if (idx >= this.props.targets.length) return;

        amount = this.props.targets[idx].props.amount;

        if (this.props.dataTarget) {
            this.updateGameState({
                path: this.props.dataTarget,
                data: {
                    amount
                }
            });
        }

        this.props.onSetTarget.call(this);

        this.setState({
            idx,
            amount,
            target: this.props.targets[idx].props.name,
            targetClass: this.props.targets[idx].props.targetClass,
        });
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);

        if (props.attempt && props.attempt !== this.props.attempt) {
            this.onChange(props.attempt);
        }

        if (_.isFinite(props.setTarget) && props.setTarget !== this.props.setTarget) {
            this.setTarget(props.setTarget);
        }
    }

    getClassNames() {
        return classNames(
            'target',
            this.state.targetClass,
            super.getClassNames(),
        );
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                <div className="assets">
                    {this.renderContentList('assets')}
                </div>
                <div className="targets">
                    {this.renderContentList('targets')}
                </div>
            </div>
        );
    }
}

Target.defaultProps = _.defaults({
    targets: [<skoash.Component />],
    onUpdateState: _.noop,
    onSetTarget: _.noop,
    loop: false,
}, skoash.Component.defaultProps);

export default Target;
