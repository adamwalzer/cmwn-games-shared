import classNames from 'classnames';
import shortid from 'shortid';

import Selectable from 'shared/components/selectable/0.1';

class Carousel extends Selectable {
    constructor(props) {
        super(props);

        this.next = this.next.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);

        if (nextProps.selected && nextProps.selected !== this.props.selected) {
            this.select();
        }

        if (nextProps.next && nextProps.next !== this.props.next) {
            this.next();
        }
    }

    start() {
        super.start();
        if (this.props.nextOnStart) this.next();
    }

    next() {
        var classes = this.state.classes;
        var list = this.state.list;
        var item = this.refs.bin.get(1)[0];
        list = list.concat(
            <item.type
                {...item.props}
                {...{
                    'data-key': shortid.generate()
                }}
            />
        );
        list.shift();
        classes[0] = '';
        this.enabled = this.props.enabled;

        this.setState({
            classes,
            list,
        }, () => {
            setTimeout(() => {
                classes[0] = 'LEAVE';
                this.setState({
                    classes,
                });
            }, this.props.pause);
        });
    }

    bootstrap() {
        var list;
        // skoash.Component is not the super here, but this is what we want
        skoash.Component.prototype.bootstrap.call(this);

        list = this.refs.bin ? this.refs.bin.get(this.props.showNum + 1) : this.props.list;

        _.each(list, item => {
            return (
                <item.type
                    {...item.props}
                    {...{
                        'data-key': shortid.generate()
                    }}
                />
            );
        });

        this.setState({
            list
        });
    }

    selectHelper() {
        if (!this.enabled) return;

        if (this.props.dataTarget) {
            this.updateGameState({
                path: this.props.dataTarget,
                data: {
                    target: this.state.list[this.props.targetIndex]
                }
            });
        }

        this.enabled = false;

        this.props.onSelect.call(this, this.state.list[this.props.targetIndex]);
    }

    getClassNames() {
        return classNames('carousel', super.getClassNames());
    }

    /*
     * shortid is intentionally not used for key here because we want to make sure
     * that the element is transitioned and not replaced.
     */
    renderList() {
        var list = this.state.list || this.props.list;
        return list.map((li, key) => {
            var ref;
            var onTransitionEnd;
            ref = li.ref || li.props['data-ref'] || key;
            onTransitionEnd = key === 0 ? this.next : null;
            return (
                <li.type
                    {...li.props}
                    className={this.getClass(key, li)}
                    data-ref={ref}
                    data-message={li.props.message}
                    onTransitionEnd={onTransitionEnd}
                    ref={ref}
                    key={key}
                    data-key={shortid(key)}
                />
            );
        });
    }

    render() {
        var onClick = this.props.clickable ? this.state.selectFunction.bind(this) : null;
        return (
            <div>
                {this.renderBin()}
                <div className={this.getClassNames()} onClick={onClick}>
                    {this.renderList()}
                </div>
            </div>
        );
    }
}

Carousel.defaultProps = _.defaults({
    showNum: 3,
    targetIndex: 1,
    enabled: true,
    nextOnStart: true,
    pause: 500,
    clickable: false,
    onSelect: _.noop,
}, Selectable.defaultProps);

export default Carousel;
