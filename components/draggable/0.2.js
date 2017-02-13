import _ from 'lodash';
import classNames from 'classnames';

class Draggable extends skoash.Component {
    constructor() {
        super();

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
    }

    shouldDrag() {
        return true;
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

        if (e.target !== this.refs.el) return;
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

        if (!this.props.return) {
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

        if (typeof this.props.dragRespond === 'function') {
            this.props.dragRespond.call(this, this);
        }

        if (typeof cb === 'function') {
            cb.call(this);
        }
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
        this.dropRespond();

        if (this.props.return) {
            this.returnToStart();
        } else {
            this.setState({
                dragging: false,
                return: this.props.return,
            });
        }

        if (typeof cb === 'function') {
            cb.call(this);
        }
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

        if (this.props.stayOnCorrect && this.state.correct) {
            endX = this.state.endX;
            endY = this.state.endY;
        } else {
            endX = this.state.startX;
            endY = this.state.startY;
        }

        this.setState({
            dragging: false,
            return: this.props.return,
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

    dropRespond() {
        var corners;

        corners = this.setCorners();

        if (typeof this.props.dropRespond === 'function') {
            this.props.dropRespond.call(this, this, corners);
        }
    }

    setCorners() {
        var top;
        var left;
        var width;
        var height;
        var el;
        var corners = [];

        left = 0;
        top = 0;
        el = this.refs.el;
        width = el.offsetWidth;
        height = el.offsetHeight;

        while (el) {
            if (el.className.indexOf('screen') !== -1) {
                break;
            }

            left += el.offsetLeft || 0;
            top += el.offsetTop || 0;
            el = el.offsetParent;
        }

        left += ((this.state.endX - this.state.startX) / this.state.zoom);
        top += ((this.state.endY - this.state.startY) / this.state.zoom);

        for (let i = 0; i < 4; i++) {
            corners.push({
                x: left + width * (i === 1 || i === 2 ? 1 : 0),
                y: top + height * (i > 1 ? 1 : 0),
            });
        }

        this.setState({
            corners,
        });

        return corners;
    }

    componentDidMount() {
        this.bootstrap();
    }

    bootstrap() {
        super.bootstrap();

        this.setZoom();

        this.refs.el.addEventListener('mousedown', this.mouseDown);
        this.refs.el.addEventListener('touchstart', this.touchStart);

        window.addEventListener('resize', this.setZoom.bind(this));
    }

    setZoom() {
        skoash.trigger('getState').then(state => {
            this.setState({
                zoom: state.scale,
            });
        });
    }

    getStyle() {
        var x;
        var y;

        x = this.state.endX - this.state.startX;
        y = this.state.endY - this.state.startY;

        return {
            transform: `translateX(${x}px) translateY(${y}px)`,
            WebkitTransform: `translateX(${x}px) translateY(${y}px)`,
        };
    }

    getClassNames() {
        return classNames({
            draggable: true,
            DRAGGING: this.state.dragging,
            RETURN: this.state.return,
            CORRECT: this.state.correct,
        }, this.state.classes, super.getClassNames());
    }

    render() {
        return (
            <div
                ref="el"
                className={this.getClassNames()}
                style={this.getStyle()}
            >{this.props.children}</div>
        );
    }
}

export default Draggable;
