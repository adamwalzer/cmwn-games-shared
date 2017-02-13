import classNames from 'classnames';

class Target extends skoash.Component {
    constructor() {
        super();
    }

    start() {
        super.start();
        this.setTarget();
    }

    setTarget(idx = 0) {
        if (this.props.loop) idx = idx % this.props.targets.length;
        if (idx >= this.props.targets.length) return;

        this.updateGameState({
            path: this.props.dataTarget,
            data: {
                object: this.props.targets[idx],
            }
        });

        this.props.onSetTarget.call(this);

        this.setState({
            idx,
            target: this.props.targets[idx],
        });
    }

    nextTarget() {
        this.setTarget(this.state.idx + 1);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);

        if (_.isFinite(props.setTarget) && props.setTarget !== this.props.setTarget) {
            this.setTarget(props.setTarget);
        }

        if (props.nextTarget && props.nextTarget !== this.props.nextTarget) {
            this.nextTarget();
        }
    }

    getClassNames() {
        return classNames(
            'target',
            super.getClassNames(),
            _.get(this.state, 'target.props.name')
        );
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                {this.renderContentList('targets')}
            </div>
        );
    }
}

Target.defaultProps = _.defaults({
    targets: [<skoash.Component target="1" />],
    dataTarget: 'target',
    onUpdateState: _.noop,
    onSetTarget: _.noop,
    loop: false,
}, skoash.Component.defaultProps);

export default Target;
