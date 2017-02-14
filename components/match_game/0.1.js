import Selectable from 'shared/components/selectable/0.1';
import classNames from 'classnames';

class MatchGame extends Selectable {
    start() {
        super.start();
        this.bootstrap();

        this.setState({
            matched: [],
        });
    }

    selectHelper(e, classes) {
        var dataRef;
        var activeDataRef;
        var message;
        var target;
        var matched;

        target = e.target.closest('LI');

        if (!target) return;

        dataRef = target.getAttribute('data-ref');
        message = target.getAttribute('data-message');
        classes[dataRef] = this.state.selectClass;
        matched = this.state.matched || [];

        if (matched.indexOf(message) !== -1) return;
        this.props.onSelect.call(this);

        if (this.state.message) {
            if (message === this.state.message && dataRef !== this.state.activeDataRef) {
                this.props.onMatch.call(this, message);
                matched.push(message);
                this.updateScreenData({
                    key: this.props.matchTarget,
                    data: {
                        message,
                    }
                });
            } else {
                setTimeout(function (oldDataRef) {
                    delete classes[dataRef];
                    delete classes[oldDataRef];
                    this.setState({classes});
                }.bind(this, this.state.activeDataRef), this.props.flipPause || 500);
            }
            message = null;
        } else {
            activeDataRef = dataRef;
        }

        this.setState({
            classes,
            message,
            activeDataRef,
            matched,
        });

        _.each(this.refs, (ref, key) => {
            if (key === message) ref.complete();
        });

        this.checkComplete();
    }

    getClassNames() {
        return classNames({
            matchable: true,
            COMPLETE: this.state.complete,
        }, this.props.className);
    }
}

MatchGame.defaultProps = _.merge(Selectable.defaultProps, {
    matchTarget: 'match-game',
    selectClass: 'HIGHLIGHTED',
    onMatch: _.noop,
    onSelect: _.noop,
});

export default MatchGame;
