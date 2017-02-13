import classNames from 'classnames';

import Catchable from 'shared/components/catchable/0.1';

class Catch extends skoash.Component {
    constructor(props) {
        super(props);

        this.state = {
            canCatch: true,
        };

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onResize = this.onResize.bind(this);
        this.checkCollisions = this.checkCollisions.bind(this);
    }

    bootstrap() {
        super.bootstrap();
        this.onResize();
        this.attachMouseEvents();
        window.addEventListener('resize', this.onResize);

        this.bucketNode = ReactDOM.findDOMNode(this.refs.bucket);
        this.catchableNodes = _.map(this.props.catchables, function (val, key) {
            return ReactDOM.findDOMNode(this.refs[`${key}-catchable`]);
        }.bind(this));
        _.forEach(this.catchableNodes, function (node, key) {
            var catchableRef = this.refs[`${key}-catchable`];
            node.addEventListener('animationiteration', catchableRef.reset, false);
        }.bind(this));
    }

    attachMouseEvents() {
        var catchRef = this.refs['catch-component'];
        if (catchRef) {
            catchRef.addEventListener('mousemove', this.onMouseMove);
            catchRef.addEventListener('touchstart', this.onMouseMove);
            catchRef.addEventListener('touchmove', this.onMouseMove);
        }
    }

    onMouseMove(e) {
        this.setState({
            mouseX: e.pageX
        });
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

    start() {
        super.start(this.checkCollisions);
        this.bootstrap();
    }

    restart() {
        this.checkCollisions();
    }

    stop() {
        this.setState({
            started: false
        });
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

    selectCatchable(catchableNode, key) {
        if (!this.state.started || this.state.paused || !this.state.canCatch ||
            !catchableNode.canCatch()) return;
        catchableNode.markCaught();
        if (catchableNode.props.isCorrect) {
            this.correct(catchableNode, key);
        } else {
            this.incorrect(catchableNode, key);
        }
    }

    correct(catchable, key) {
        this.playMedia('correct');
        this.props.onCorrect.call(this, catchable, key);
    }

    incorrect(catchable, key) {
        this.playMedia('incorrect');
        this.props.onIncorrect.call(this, catchable, key);
    }

    checkCollisions() {
        var bucketRect = this.bucketNode.getBoundingClientRect();
        if (!this.state.started || this.state.paused) return;
        _.forEach(this.catchableNodes, function (val, key) {
            if (this.isColliding(bucketRect, val.getBoundingClientRect())) {
                this.selectCatchable(this.refs[`${key}-catchable`], key);
            }
        }.bind(this));
        window.requestAnimationFrame(this.checkCollisions);
    }

    isColliding(bucketRect, catchRect) {
        var xCenter = catchRect.left + (catchRect.right - catchRect.left) / 2;
        var yOffset = (catchRect.bottom - catchRect.top) / 6;
        return (bucketRect.top < catchRect.bottom - yOffset && bucketRect.top > catchRect.top + yOffset &&
            xCenter > bucketRect.left && xCenter < bucketRect.right);
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

    getStyle() {
        var left = (this.state.mouseX / this.state.zoom) - (this.state.bucketWidth / 2);
        if (this.props.bucketInBounds) {
            left = left < 1 ? 1 : left;
            left = left >= this.state.leftBound ? this.state.leftBound - 1 : left;
        }

        return {
            left: `${left}px`
        };
    }

    renderBucket() {
        return (
            <this.props.bucket.type
                {...this.props.bucket.props}
                ref="bucket"
                style={this.getStyle()}
            />
        );
    }

    renderCatchables() {
        return this.props.catchables.map((item, key) =>
            <Catchable
                {...item.props}
                key={key}
                ref={`${key}-catchable`}
            />
        );
    }

    getClassNames() {
        return classNames('catch', super.getClassNames());
    }

    render() {
        return (
            <div ref="catch-component" className={this.getClassNames()}>
                <ul className="items">
                    {this.renderCatchables()}
                </ul>
                {this.renderBucket()}
            </div>
        );
    }

}

Catch.defaultProps = _.defaults({
    catchables: [],
    bucketInBounds: true,
    bucket: <skoash.Component />,
    onCorrect: _.noop,
    onIncorrect: _.noop,
}, skoash.Component.defaultProps);

export default Catch;
