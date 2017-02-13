import classNames from 'classnames';

import SelectableReveal from 'shared/components/selectable_reveal/0.1.js';
import Selectable from 'shared/components/selectable/0.1.js';

class TargetSelectable extends SelectableReveal {
    constructor() {
        super();

        this.selectRespond = this.selectRespond.bind(this);
    }

    start() {
        super.start();

        this.list = _.map(this.refs.selectable.refs, ref =>
      ReactDOM.findDOMNode(ref)
    );

        this.setItem();
    }

    selectRespond(message) {
        if (typeof message === 'object') {
            message = message.props.message;
        }

        if (this.state.target) {
            if (this.state.target === message) {
                this.onCorrect(message);
            } else {
                this.onIncorrect(message);
            }
        } else if (this.props.allCorrect) {
            this.onCorrect(message);
        }
    }

    onCorrect(message) {
        var classes;
        this.playMedia('correct');
        this.playMedia('correct-sound');

        classes = this.refs.selectable.state.classes;
        classes[message] = 'SELECTED';
        this.refs.selectable.setState({
            classes
        }, () => {
            this.setItem(this.state.idx + 1);
            _.each(this.refs.selectable.refs, (ref, key) => {
                if (ref && key === message) ref.complete();
            });
        });
    }

    onIncorrect() {
        this.playMedia('incorrect');
        this.playMedia('incorrect-sound');
    }

    setItem(idx = 0) {

        if (this.props.loop) idx = idx % this.props.targets.length;
        if (idx >= this.props.targets.length) return;

        this.setState({
            idx,
            target: this.props.targets[idx].ref,
            amount: this.props.targets[idx].props.amount
        }, () => {
            if (this.state.target) {
                setTimeout(() => {
                    this.refs.selectable.setState({
                        classes: []
                    });
                }, 450);

                for (let i = 3; i < 8; i++) {
                    setTimeout(() => {
                        _.forEach(this.list, node => {
                            node.style.order = Math.round(20 * Math.random());
                        });
                    }, i * 150);
                }
            }
        });
    }

    getClassNames() {
        return classNames(
            super.getClassNames(),
            'target-selectable',
            this.state.target,
            this.props.className, {
                ['amount-' + this.state.amount]: typeof this.state.amount === 'number',
            }
        );
    }

    renderSelectable() {
        if (this.props.selectable) {
            return (
                <this.props.selectable.type
                    ref="selectable"
                    {...this.props.selectable.props}
                    selectRespond={this.selectRespond}
                    onSelect={this.selectRespond}
                />
            );
        }

        return (
            <Selectable
                ref="selectable"
                list={this.props.selectableList}
                selectRespond={this.selectRespond}
                selectClass={this.props.selectableSelectClass}
                selectOnStart={this.props.selectOnStart}
                completeListOnClick={this.props.completeListOnClick}
            />
        );
    }

    renderTargets() {
        return (
            <div className="header">
                {this.renderContentList('targets')}
            </div>
        );
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                {this.renderAssets()}
                {this.renderTargets()}
                {this.renderSelectable()}
            </div>
        );
    }
}

TargetSelectable.defaultProps = _.defaults({
    loop: false,
}, SelectableReveal.defaultProps);

export default TargetSelectable;
