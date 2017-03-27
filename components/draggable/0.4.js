import classNames from 'classnames';

class Draggable extends skoash.Component {
    constructor(props) {
        super(props);

        this.state = {
            endX: 0,
            endY: 0,
            zoom: 1,
        };

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);

        this.moveEvent = this.moveEvent.bind(this);

        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);

        this.setZoom = this.setZoom.bind(this);
    }

    shouldDrag() {
        return this.props.shouldDrag.call(this);
    }

    markCorrect() {
        this.setState({
            correct: true,
        });
    }

    markIncorrect() {
        this.setState({
            correct: false,
        });

        if (this.props.returnOnIncorrect) {
            this.returnToStart();
        }
    }

    startEvent(e, cb) {
        var rect;
        var startX;
        var startY;
        var endX;
        var endY;
        var grabX;
        var grabY;

        if (e.target !== this.DOMNode) return;
        if (!this.shouldDrag()) return;

        if (e.targetTouches && e.targetTouches[0]) {
            rect = e.target.getBoundingClientRect();
            e = e.targetTouches[0];
            e.offsetX = e.pageX - rect.left;
            e.offsetY = e.pageY - rect.top;
        }

        grabX = e.offsetX / this.state.zoom;
        grabY = e.offsetY / this.state.zoom;

        startX = endX = (e.pageX / this.state.zoom - grabX);
        startY = endY = (e.pageY / this.state.zoom - grabY);

        if (!this.state.return) {
            startX = _.isFinite(this.state.grabX) ?
                this.state.startX + this.state.grabX - grabX :
                startX;
            startY = _.isFinite(this.state.grabY) ?
                this.state.startY + this.state.grabY - grabY :
                startY;
        }

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

        this.updateScreenData({
            path: this.props.draggableTarget,
            data: {
                dragging: this,
                dropped: null,
                returning: null,
            },
        });

        this.props.onDrag.call(this, this);

        if (typeof cb === 'function') cb.call(this);
    }

    attachMouseEvents() {
        window.addEventListener('mousemove', this.moveEvent);
        window.addEventListener('mouseup', this.mouseUp);
    }

    attachTouchEvents() {
        window.addEventListener('touchmove', this.moveEvent);
        window.addEventListener('touchend', this.touchEnd);
    }

    mouseDown(e) {
        this.startEvent(e, this.attachMouseEvents);
    }

    touchStart(e) {
        this.startEvent(e, this.attachTouchEvents);
    }

    moveEvent(e) {
        e = e.targetTouches && e.targetTouches[0] ? e.targetTouches[0] : e;

        this.setState({
            endX: (e.pageX / this.state.zoom - this.state.grabX),
            endY: (e.pageY / this.state.zoom - this.state.grabY),
        });
    }

    endEvent(cb) {
        this.onDrop();

        if (this.props.return) {
            this.returnToStart();
        } else {
            this.setState({
                dragging: false,
            });
        }

        if (typeof cb === 'function') cb.call(this);
    }

    setEnd(endX, endY) {
        this.setState({
            endX,
            endY
        });
    }

    returnToStart() {
        var endX;
        var endY;
        var doReturn;

        if (this.props.stayOnCorrect && this.state.correct) {
            endX = this.state.endX;
            endY = this.state.endY;
            doReturn = false;
        } else {
            endX = this.state.startX;
            endY = this.state.startY;
            doReturn = true;

            this.updateScreenData({
                path: this.props.draggableTarget,
                data: {
                    dropping: null,
                    dragging: null,
                    returning: this,
                },
            });
        }

        this.setState({
            dragging: false,
            return: doReturn,
            endX,
            endY,
        });
    }

    detachMouseEvents() {
        window.removeEventListener('mousemove', this.moveEvent);
        window.removeEventListener('mouseup', this.mouseUp);
    }

    detachTouchEvents() {
        window.removeEventListener('touchmove', this.moveEvent);
        window.removeEventListener('touchend', this.touchEnd);
    }

    mouseUp() {
        this.endEvent(this.detachMouseEvents);
    }

    touchEnd() {
        this.endEvent(this.detachTouchEvents);
    }

    onDrop() {
        this.updateScreenData({
            path: this.props.draggableTarget,
            data: {
                dragging: null,
                dropped: this,
                returning: null,
            },
        });

        this.props.onDrop.call(this, this);
    }

    bootstrap() {
        super.bootstrap();

        this.setZoom();

        this.DOMNode = ReactDOM.findDOMNode(this);

        this.DOMNode.addEventListener('mousedown', this.mouseDown);
        this.DOMNode.addEventListener('touchstart', this.touchStart);

        window.addEventListener('resize', this.setZoom);
    }

    setZoom() {
        skoash.trigger('getState').then(state => {
            this.setState({
                zoom: state.scale,
            });
        });
    }

    getStyle() {
        let x = this.state.endX - this.state.startX || 0;
        let y = this.state.endY - this.state.startY || 0;
        let scale = this.state.scale || 1;
        let rotate = this.state.rotate || 0;
        let transform = `translateX(${x}px) translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`;

        return _.defaults({
            transform,
            WebkitTransform: transform,
        }, this.state.style, this.props.style);
    }

    getClassNames() {
        return classNames({
            DRAGGING: this.state.dragging,
            RETURN: this.state.return,
            CORRECT: this.state.correct,
        }, 'draggable', this.state.classes, super.getClassNames());
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);

        if (props.incorrect && props.incorrect !== this.props.incorrect) {
            this.markIncorrect(props.dropped);
        }
    }

    render() {
        return (
            <this.props.type
                className={this.getClassNames()}
                data-message={this.props.message}
                style={this.getStyle()}
			>
				{this.renderContentList()}
            </this.props.type>
        );
    }
}

Draggable.defaultProps = _.defaults({
    draggableTarget: 'draggable',
    shouldDrag: () => true,
    return: false,
    returnOnIncorrect: false,
    stayOnCorrect: true,
    onDrop: _.noop,
    onDrag: _.noop,
}, skoash.Component.defaultProps);

export default Draggable;
