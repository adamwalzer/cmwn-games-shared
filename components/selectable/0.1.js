// As of skoash 1.1.0 this component can be found at skoash.Selectable
/* eslint-disable no-console */
console.warn('As of skoash 1.1.0 this component can be found at skoash.Selectable');
/* eslint-enable no-console */

import classNames from 'classnames';

class Selectable extends skoash.Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: {},
            selectFunction: this.select,
        };
    }

    start() {
        var selectClass;
        var selectFunction;
        var classes = this.state.classes;

        super.start();

        selectClass = this.props.selectClass || this.state.selectClass || 'SELECTED';
        selectFunction = selectClass === 'HIGHLIGHTED' ? this.highlight : this.select;

        if (this.props.selectOnStart) {
            classes[this.props.selectOnStart] = selectClass;
        }

        this.setState({
            started: true,
            classes,
            selectFunction,
            selectClass,
        });
    }

    bootstrap() {
        super.bootstrap();

        if (this.refs.bin) {
            this.setState({
                list: this.refs.bin.getAll()
            });
        }
    }

    selectHelper(e, classes) {
        var ref;
        var dataRef;
        var target;
        var id;
        var isCorrect;
        var self = this;

        if (typeof e === 'string') {
            dataRef = e;
        } else {
            target = e.target.closest('LI');

            if (!target) return;

            dataRef = target.getAttribute('data-ref');
        }

        ref = self.refs[dataRef];

        isCorrect = (ref && ref.props && ref.props.correct) ||
            (!self.props.answers || !self.props.answers.length ||
                self.props.answers.indexOf(dataRef) !== -1);

        if (self.props.allowDeselect && classes[dataRef]) {
            delete classes[dataRef];
        } else if (isCorrect) {
            classes[dataRef] = self.state.selectClass;
        }

        self.setState({
            classes,
        });

        self.props.selectRespond.call(self, dataRef);
        self.props.onSelect.call(self, dataRef);

        if (self.props.chooseOne) self.complete();

        if (self.props.dataTarget) {
            self.updateGameState({
                path: self.props.dataTarget,
                data: {
                    target: ref
                }
            });
        }

        if (self.props.completeListOnClick) {
            _.each(self.refs, (r, k) => {
                if (k === id) _.invoke(r, 'complete');
            });
        }

        _.each(self.refs, (r, k) => {
            if (k === dataRef) _.invoke(r, 'complete');
        });
    }

    select(e) {
        var classes = [];
        this.selectHelper(e, classes);
    }

    highlight(e) {
        var classes = this.state.classes;
        this.selectHelper(e, classes);
    }

    getClass(key, li) {
        return classNames(
            li.props.className,
            this.state.classes[key],
            this.state.classes[li.props['data-ref']],
            this.state.classes[li.props['data-key']]
        );
    }

    getClassNames() {
        return classNames('selectable', super.getClassNames());
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);

        if (props.select && props.select !== this.props.select) {
            this.state.selectFunction.call(this, props.select);
        }
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

    renderList() {
        var list = this.props.list || this.state.list || [];
        return _.map(list, (li, key) => {
            var dataRef = li.props['data-ref'] || key;
            var ref = li.ref || li.props.id || dataRef;
            var message = li.props.message || '' + key;
            return (
                <li.type
                    {...li.props}
                    type="li"
                    className={this.getClass(key, li)}
                    message={message}
                    data-message={message}
                    data-ref={dataRef}
                    ref={ref}
                    key={key}
                />
            );
        });
    }

    render() {
        return (
            <div>
                {this.renderBin()}
                <ul className={this.getClassNames()} onClick={this.state.selectFunction.bind(this)}>
                    {this.renderList()}
                </ul>
            </div>
        );
    }
}

Selectable.defaultProps = _.defaults({
    selectClass: 'SELECTED',
    completeListOnClick: true,
    selectRespond: _.noop,
    onSelect: _.noop,
}, skoash.Component.defaultProps);

export default Selectable;
