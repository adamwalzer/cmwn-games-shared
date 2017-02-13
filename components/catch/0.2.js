import classNames from 'classnames';
import Catchable from 'shared/components/catchable/0.1';

class Catcher extends skoash.Component {
    constructor() {
        super();

        this.state = {
            startX: 0,
            endX: 0,
            canCatch: true,
            stamp: 0,
            test: 0,
            classes: []
        };

        this.next = this.next.bind(this);

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);

        this.moveEvent = this.moveEvent.bind(this);

        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);

        this.checkCollisions = this.checkCollisions.bind(this);

        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {
        this.bucketNode = ReactDOM.findDOMNode(this.refs.el);
        this.limitNode = ReactDOM.findDOMNode(this.refs.limit);
        this.catchableNodes = _.map(this.props.catchables, function (val, key) {
            return ReactDOM.findDOMNode(this.refs[`${key}-catchable`]);
        }.bind(this));
    }

    bootstrap() {
        var catchables;

        super.bootstrap();

        catchables = this.props.catchables;

        this.setState({
            catchables,
            started: true

        });

        this.onResize();
        this.attachMouseEvents();
        window.addEventListener('resize', this.onResize);
        this.refs.el.addEventListener('mousedown', this.mouseDown);
        this.refs.el.addEventListener('touchstart', this.touchStart);
        _.forEach(this.catchableNodes, function (node, key) {
            var catchableRef = this.refs[`${key}-catchable`];
            node.addEventListener('animationiteration', catchableRef.reset, false);
        }.bind(this));
    }

    selectCatchable(catchableNode, key) {
        if (!this.state.started || this.state.paused ||
            !this.state.canCatch || !catchableNode.canCatch()) return;
        catchableNode.markCaught();
        if (catchableNode.props.isCorrect) {
            this.correct(catchableNode, key);
        } else {
            this.incorrect(catchableNode, key);
        }
    }

    isColliding(bucketRect, catchableRect) {
        var xCenter = catchableRect.left + (catchableRect.right - catchableRect.left) / 2;
        var yOffset = (catchableRect.bottom - catchableRect.top) / 6;
        return (bucketRect.top < catchableRect.bottom - yOffset &&
            bucketRect.top > catchableRect.top + yOffset &&
            xCenter > bucketRect.left && xCenter < bucketRect.right);
    }

    checkCollisions() {
        var bucketRect = this.bucketNode.getBoundingClientRect();
        var limitRect = this.limitNode.getBoundingClientRect();
        if (!this.state.started || this.state.paused) return;
        _.forEach(this.catchableNodes, function (val, key) {
            if (this.isColliding(bucketRect, val.getBoundingClientRect())) {
                this.selectCatchable(this.refs[`${key}-catchable`], key);
            } else if (this.isColliding(limitRect, val.getBoundingClientRect())) {
                this.incorrect(this.refs[`${key}-catchable`], key);
            }
        }.bind(this));

        window.requestAnimationFrame(this.checkCollisions);
    }

    start() {
        super.start();
        this.bootstrap();
        this.next();
        this.checkCollisions();
    }

    pause() {
        if (this.state.started) {
            this.setState({
                paused: true
            });
        }
    }

    resume() {
        if (this.state.paused) {
            this.setState({
                paused: false
            }, () => {
                this.checkCollisions();
            });
        }
    }

    startEvent(e, cb) {
        var pageX;
        var pageY;
        var rect;
        var startX;
        var startY;
        var endX;
        var endY;
        var grabX;
        var grabY;

        if (e.target !== this.refs.el) return;

        if (e.targetTouches && e.targetTouches[0]) {
            pageX = e.targetTouches[0].pageX;
            pageY = e.targetTouches[0].pageY;
            rect = e.target.getBoundingClientRect();
            e = e.targetTouches[0];
            e.offsetX = pageX - rect.left;
            e.offsetY = pageY - rect.top;
        }

        grabX = e.offsetX;
        grabY = e.offsetY;

        startX = endX = e.pageX - grabX;
        startY = endY = e.pageY - grabY;

        if (!this.state.firstX) {
            this.setState({
                firstX: startX,
                firstY: startY,
            });
        }

        startX = _.isFinite(this.state.grabX) ?
            this.state.startX + this.state.grabX - grabX :
            startX;
        startY = _.isFinite(this.state.grabY) ?
            this.state.startY + this.state.grabY - grabY :
            startY;

        this.setState({
            dragging: true,
            return: false,
            startX,
            startY,
            grabX,
            grabY,
            endX,
            endY,
        });

        if (typeof cb === 'function') {
            cb.call(this);
        }
    }

    endEvent(cb) {
        this.setState({
            dragging: false,
            return: this.state.return,
        });

        if (typeof cb === 'function') {
            cb.call(this);
        }
    }

    moveEvent(e) {
        if (e.targetTouches && e.targetTouches[0]) {
            e.pageX = e.targetTouches[0].pageX;
            e.pageY = e.targetTouches[0].pageY;
        }

        this.setState({
            endX: e.pageX - this.state.grabX,
            endY: e.pageY - this.state.grabY,
        });
    }

    mouseUp() {
        this.endEvent(this.detachMouseEvents);
    }

    touchEnd() {
        this.endEvent(this.detachTouchEvents);
    }

    mouseDown(e) {
        this.startEvent(e, this.attachMouseEvents);
    }

    touchStart(e) {
        this.startEvent(e, this.attachTouchEvents);
    }

    attachMouseEvents() {
        window.addEventListener('mousemove', this.moveEvent);
        window.addEventListener('mouseup', this.mouseUp);
    }

    attachTouchEvents() {
        window.addEventListener('touchmove', this.moveEvent);
        window.addEventListener('touchend', this.touchEnd);
    }

    detachMouseEvents() {
        window.removeEventListener('mousemove', this.moveEvent);
        window.removeEventListener('mouseup', this.mouseUp);
    }

    detachTouchEvents() {
        window.removeEventListener('touchmove', this.moveEvent);
        window.removeEventListener('touchend', this.touchEnd);
    }

    getEdges(el) {
        var top;
        var left;
        var width;
        var height;

        left = 0;
        top = 0;
        width = el.offsetWidth;
        height = el.offsetHeight;

        while (el) {
            if (el.className && el.className.indexOf('screen') !== -1) {
                break;
            }

            left += el.offsetLeft || 0;
            top += el.offsetTop || 0;
            el = el.offsetParent;
        }

        return {
            top,
            bottom: top + height,
            left,
            right: left + width
        };
    }

    onResize() {
        skoash.trigger('getState').then(state => {
            var zoom = state.scale;
            var edges = this.getEdges(this.bucketNode);
            var bucketWidth = edges.right - edges.left;
            var leftBound = this.bucketNode.offsetParent ?
                this.bucketNode.offsetParent.offsetWidth - bucketWidth : 0;

            this.setState({
                bucketTop: edges.top,
                bucketBottom: edges.bottom,
                bucketWidth,
                leftBound,
                zoom
            });
        });
    }

    next() {
        var time = Date.now();
        var catchables = [];
        var catchable;
        if (!this.state.started || this.state.paused) return;
        if (time >= this.state.test) {
            this.setState({
                test: time + this.props.speed
            });
            catchable = _.sample(this.props.catchables);
            catchables = catchables.concat(catchable);
            this.setState({
                catchables,
                position: _.sample(this.props.pipes)
            });
            window.requestAnimationFrame(this.next);
        } else {
            window.requestAnimationFrame(this.next);
        }
    }

    correct(catchable, key) {
        if (typeof this.props.onCorrect === 'function') {
            this.props.onCorrect.call(this, catchable, key);
        }
    }

    incorrect(catchable, key) {
        if (typeof this.props.onIncorrect === 'function') {
            this.props.onIncorrect.call(this, catchable, key);
        }
    }

    getStyle() {
        var x;

        x = ((this.state.endX - this.state.startX) / this.state.zoom);

        return {
            transform: `translateX(${x}px)`,
            WebkitTransform: `translateX(${x}px)`,
        };
    }

    getBucketClassNames() {
        return classNames({
            bucket: true,
            [this.props.className]: this.props.className,
            [this.props.message]: this.props.message,
            DRAGGING: this.state.dragging,
            RETURN: this.state.return,
            CORRECT: this.state.correct,
        }, super.getClassNames());
    }

    getCatchableClassNames(item) {
        return classNames(
            item.props.className,
            this.state.position,
            {
                slow: this.props.speed === 6000,
                medium: this.props.speed === 4000,
                fast: this.props.speed === 2000
            }
        );
    }

    getCatcherClasses() {
        var classes = '';

        if (this.state.complete || this.props.isComplete) classes += ' COMPLETE';

        return classes;
    }

    renderBucket() {
        return (
            <div
                ref="el"
                className={this.getBucketClassNames()}
                style={this.getStyle()}
            >{this.props.children}</div>
        );
    }

    renderCatchables() {
        var catchables = this.state.catchables || this.props.catchables;
        return catchables.map((item, key) =>
            <Catchable
                {...item.props}
                key={key}
                ref={`${key}-catchable`}
                data-ref={`${key}-catchable`}
                className={this.getCatchableClassNames(item)}
            />
        );
    }

    render() {
        return (
            <div ref="catch-component" className={'catcher' + this.getCatcherClasses()}>
                <ul className="items">
                    {this.renderCatchables()}
                </ul>
                <div ref="limit" className="limit"></div>
                {this.renderBucket()}
            </div>
        );
    }
}

Catcher.defaultProps = _.merge(skoash.Component.defaultProps, {
    catchables: [],
    bucketInBounds: true,
    speed: 6000
});

export default Catcher;
