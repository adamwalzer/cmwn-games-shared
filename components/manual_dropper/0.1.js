import classNames from 'classnames';

import Catchable from 'shared/components/catchable/0.2';

const ITEM = 'items-';
const DROPPED = 'DROPPED';

class Dropper extends skoash.Component {
    constructor(props) {
        super(props);

        this.state = _.defaults({
            items: {},
        }, this.state);
    }

    bootstrap() {
        super.bootstrap();
        this.DOMNode = ReactDOM.findDOMNode(this);
    }

    start() {
        super.start();

        this.itemCount = 0;
        this.firstItemIndex = 0;

        this.setState({
            items: {},
        }, () => {
            this.next(this.props.amount, false);
        });
    }

    getFirstItem() {
        return this.refs[ITEM + this.firstItemIndex];
    }

    drop(props) {
        var itemRef = this.getFirstItem();
        props = props || this.props;
        itemRef.addClassName(props.dropClass || DROPPED);

        this.updateScreenData({
            key: [props.refsTarget, 'drop'],
            data: false,
        });

        props.onDrop.call(this, itemRef);
    }

    pickUp(props) {
        var itemRef = this.getFirstItem();
        props = props || this.props;
        itemRef.removeClassName(props.dropClass || DROPPED);
        itemRef.reset();

        this.updateScreenData({
            key: [props.refsTarget, 'pickUp'],
            data: false,
        });

        props.onPickUp.call(this, itemRef);
    }

    next(amount = 1, shift = true) {
        var items = this.state.items;

        _.each(this.refs.bin.get(amount), v => {
            items[this.itemCount++] = (
                <v.type
                    {...v.props}
                    onReady={function () {
                        this.start();
                    }}
                />
            );
        });

        if (shift) delete items[this.firstItemIndex++];

        this.setState({
            items
        }, () => {
            this.afterNext();
        });
    }

    afterNext() {
        let refs = _.filter(this.refs, (v, k) => !k.indexOf(ITEM));
        this.invokeChildrenFunction('markCatchable');

        this.updateScreenData({
            key: this.props.refsTarget,
            data: {
                refs,
                next: false,
            }
        });

        this.props.onNext.call(this);
    }

    caught(catchableRefKey) {
        _.invoke(this.refs[catchableRefKey], 'markCaught');
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);

        if (props.next === true && props.next !== this.props.next) {
            this.next();
        }

        if (props.drop === true && props.drop !== this.props.drop) {
            this.drop(props);
        }

        if (props.pickUp === true && props.pickUp !== this.props.pickUp) {
            this.pickUp(props);
        }

        if (props.caught && props.caught !== this.props.caught) {
            this.caught(props.caught);
        }
    }

    getClassNames() {
        return classNames('manual-dropper', super.getClassNames());
    }

    /*
     * shortid is intentionally not used for key here because we want to make sure
     * that the element is transitioned and not replaced.
     */
    renderItems() {
        return _.map(this.state.items, (item, key) => {
            var ref = ITEM + key;
            if (!item) return null;
            return (
                <item.type
                    {...item.props}
                    data-ref={ref}
                    data-message={item.props.message}
                    ref={ref}
                    key={key}
                />
            );
        });
    }

    renderBin() {
        return (
            <this.props.bin.type
                {...this.props.bin.props}
                ref="bin"
            />
        );
    }

    render() {
        return (
            <div
                {...this.props}
                onTransitionEnd={this.props.onTransitionEnd.bind(this)}
                className={this.getClassNames()}
            >
                {this.renderBin()}
                <div>
                    {this.renderContentList()}
                </div>
                <ul className="items">
                    {this.renderItems()}
                </ul>
            </div>
        );
    }
}

Dropper.defaultProps = _.defaults({
    dropClass: DROPPED,
    amount: 1,
    bin: (
        <skoash.Randomizer
            bin={[
                <Catchable />,
            ]}
        />
    ),
    refsTarget: 'manual-dropper',
    onDrop: _.noop,
    onPickUp: _.noop,
    onNext: _.noop,
    next: false,
    drop: false,
    onTransitionEnd: _.noop,
}, skoash.Component.defaultProps);

export default Dropper;
