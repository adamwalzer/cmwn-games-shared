import Selectable from 'shared/components/selectable/0.1';

class SelectableAll extends Selectable {
    constructor() {
        super();

        this.count = this.count.bind(this);

        this.setState({
            selected: 0,
            list: [],
        });
    }

    bootstrap() {
        var self = this;
        super.bootstrap();

        if (self.refs.bin) {
            self.setState({
                list: self.refs.bin.getAll()
            }, () => {
                setTimeout(() => {
                    self.launch();
                }, self.props.launchPause);
            });
        } else {
            self.launch();
        }
    }


    launch() {
        var list;
        var indicesLeft;
        var classes;
        var self = this;
        list = self.state.list;

        indicesLeft = [...Array(list.length).keys()];
        classes = {};

        for (let i = 0; i < list.length; i++) {
            setTimeout(() => {
                var j = Math.floor(Math.random() * indicesLeft.length);
                var index = indicesLeft[j];
                indicesLeft.splice(j, 1);

                classes[index] = 'LAUNCHED';
                self.setState({classes});
            }, self.props.pause);
        }
    }

    next(key) {
        var self = this;
        var classes = self.state.classes;
        var list = self.state.list;

        list.splice(key, 1, self.refs.bin.get(1)[0]);

        classes[key] = 'RESET';

        this.setState({
            list,
            classes
        }, () => {
            setTimeout(() => {
                classes[key] = 'LAUNCHED';
                self.setState({classes});
            }, self.props.launchPause);
        });
    }

    count() {
        var selected = this.state.selected;
        this.setState({selected: selected + 1});

        if (this.state.selected === this.props.selectNum) {
            this.complete();
        }
    }

    selectHelper(e, classes) {
        var target;
        var dataRef;
        super.selectHelper(e, classes);

        target = e.target.closest('LI');

        if (!target) return;

        dataRef = target.getAttribute('data-ref');

        this.next(dataRef);

        if (this.props.doCount) {
            this.count();
        }
    }

    renderList() {
        var list = this.props.list || this.state.list;
        if (!list) return;

        return list.map((li, key) => {
            var ref = li.ref || li.props['data-ref'] || key;
            var message = li.props.message || '' + key;
            return (
                <li.type
                    {...li.props}
                    type="li"
                    className={this.getClass(key, li)}
                    message={message}
                    data-message={message}
                    data-ref={key}
                    onTransitionEnd={this.next.bind(this, key)}
                    ref={ref}
                    key={key}
                />
            );
        });
    }

    render() {
        return (
            <div className="selectable-all">
                {this.renderBin()}
                <ul className={this.getClassNames()} onClick={this.state.selectFunction.bind(this)}>
                    {this.renderList()}
                </ul>
            </div>
        );
    }
}

SelectableAll.defaultProps = _.defaults({
    selectNum: 6,
    pause: 500,
    doCount: false,
    launchPause: 100,
    selectClass: 'SELECTED',
    selectRespond: _.noop,
    onSelect: _.noop,
}, skoash.Component.defaultProps);

export default SelectableAll;
