import classNames from 'classnames';

import Randomizer from 'shared/components/randomizer/0.1';
import Catchable from 'shared/components/catchable/0.1';

class Dropper extends skoash.Component {
    constructor() {
        super();

        this.state = _.defaults({
            items: {},
            itemCount: 0,
            itemEndXs: {},
            direction: '',
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            zoom: 1,
        }, this.state);

        this.next = this.next.bind(this);
        this.moveEvent = this.moveEvent.bind(this);
        this.setZoom = this.setZoom.bind(this);
        this.setZoomHelper = this.setZoomHelper.bind(this);
        this.nextHelper = this.nextHelper.bind(this);
        this.renderItemsHelper = this.renderItemsHelper.bind(this);
        this.afterItemTransition = this.afterItemTransition.bind(this);
    }

    bootstrap() {
        super.bootstrap();

        this.setZoom();

        this.refs.body.addEventListener('mousemove', this.moveEvent);
        this.refs.body.addEventListener('touchmove', this.moveEvent);

        window.addEventListener('resize', this.setZoom);
    }

    setZoomHelper(state) {
        this.setState({
            zoom: state.scale,
        });
    }

    setZoom() {
        skoash.trigger('getState').then(this.setZoomHelper);
    }

    nextHelper() {
        let index = this.state.itemCount - 1;
        let timeoutFunction = i => {
            let itemRef = this.refs['items-' + index];
            if (itemRef) {
                itemRef.addClassName(this.props.prepClasses[i]);
                this.props.onAddClassName.call(this, this.props.prepClasses[i]);
                if (i === this.props.prepClasses.length - 1) {
                    ReactDOM.findDOMNode(itemRef).addEventListener('transitionend', this.afterItemTransition);
                }
            }

            if (i === this.props.prepClasses.length) this.next();
        };

        for (let i = 0; i <= this.props.prepClasses.length; i++) {
            setTimeout(_.partial(timeoutFunction, i), i * this.props.prepTimeout);
        }

        this.updateGameState({
            path: this.props.refsTarget,
            data: {
                refs: _.filter(this.refs, this.refsFilter),
            }
        });
    }

    afterItemTransition() {
        let index = this.state.itemCount - 2;
        let itemEndXs = this.state.itemEndXs;
        let items = this.state.items;

        itemEndXs[index] = this.state.endX;
        delete items[index];

        this.setState({
            items,
            itemEndXs
        });
    }

    refsFilter(v, k) {
        return !k.indexOf('items-');
    }

    next(on) {
        let index;
        let items;

        if (!this.state.started || (!this.props.on && !on)) return;
        console.log('next');
        index = this.state.itemCount;
        items = this.state.items;
        items[index] = this.refs.bin.get(1)[0];

        this.setState({
            items,
            itemCount: index + 1,
        }, this.nextHelper);
    }

    moveEvent(e) {
        let endX = e.targetTouches && e.targetTouches[0] ? e.targetTouches[0].pageX : e.pageX;

        this.setState({
            endX,
            direction: endX > this.state.endX ? 'right' : 'left'
        });
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);

        if (props.on === true && props.on !== this.props.on) {
            this.next(true);
        }
    }

    getItemStyle(key) {
        let endX;
        let x;

        endX = this.state.itemEndXs[key] || this.state.endX;
        x = ((endX - this.state.startX) / this.state.zoom);

        return {
            transform: `translateX(${x}px)`,
            WebkitTransform: `translateX(${x}px)`,
        };
    }

    getStyle() {
        let x = ((this.state.endX - this.state.startX) / this.state.zoom);

        return {
            transform: `translateX(${x}px)`,
            WebkitTransform: `translateX(${x}px)`,
        };
    }

    getClassNames() {
        return classNames('dropper', this.state.direction, super.getClassNames());
    }

    renderItemsHelper(item, key) {
        let ref = 'items-' + key;
        if (!item) return null;
        return (
            <item.type
                {...item.props}
                style={this.getItemStyle(key)}
                data-ref={ref}
                data-message={item.props.message}
                ref={ref}
                key={key}
            />
        );
    }

    /*
     * shortid is intentionally not used for key here because we want to make sure
     * that the element is transitioned and not replaced.
     */
    renderItems() {
        return _.map(this.state.items, this.renderItemsHelper);
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
                ref="body"
                className={this.getClassNames()}
            >
                {this.renderBin()}
                <div
                    ref="el"
                    className="el"
                    style={this.getStyle()}
                >
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
    prepClasses: ['ready', 'set', 'go'],
    prepTimeout: 1000,
    bin: (
        <Randomizer
            bin={[
                <Catchable />,
            ]}
        />
    ),
    onStart: function () {
        this.next();
    },
    refsTarget: 'dropper',
    on: true,
}, skoash.Component.defaultProps);

export default Dropper;
