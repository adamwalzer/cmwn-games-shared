import classNames from 'classnames';

import Catch from 'shared/components/catch/0.1';

class Catcher extends Catch {
    constructor(props) {
        super(props);

        this.state = _.defaults({
            styles: [],
        }, this.state);

        this.moveEvent = this.moveEvent.bind(this);
    }

    bootstrap() {
        skoash.Component.prototype.bootstrap.call(this);
        window.addEventListener('resize', this.onResize);
        this.onResize();

        if (this.props.moveBuckets) {
            window.addEventListener('mousemove', this.moveEvent);
            window.addEventListener('touchmove', this.moveEvent);
        }
    }

    moveEvent(e) {
        this.props.onMove.call(this, e);
    }

    onReady() {
        this.bucketNodes = _.reduce(this.refs, (a, v, k) => {
            if (k.indexOf('buckets-')) return a;
            a[k] = ReactDOM.findDOMNode(v);
            return a;
        }, {});
    }

    onResize() {
        skoash.trigger('getState').then(state => {
            var zoom = state.scale;
            this.setState({
                zoom
            });
        });
    }

    checkCollisions() {
        if (!this.state.started || this.state.paused) return;
        _.each(this.bucketNodes, (bucketNode, bucketRefKey) => {
            var bucketRect = bucketNode.getBoundingClientRect();
            _.each(this.props.catchableRefs, catchableRef => {
                if (this.isColliding(bucketRect, catchableRef.DOMNode.getBoundingClientRect())) {
                    this.selectCatchable(this.refs[bucketRefKey], catchableRef);
                }
            });
        });

        window.requestAnimationFrame(this.checkCollisions);
    }

    isColliding(bucketRect, catchRect) {
        var bucketCorners = [];
        var catchableCorners = [];

        for (let i = 0; i < 4; i++) {
            bucketCorners.push({
                x: bucketRect.left + bucketRect.width * (i === 1 || i === 2 ? 1 : 0),
                y: bucketRect.top + bucketRect.height * (i > 1 ? 1 : 0),
            });
        }

        for (let i = 0; i < 4; i++) {
            catchableCorners.push({
                x: catchRect.left + catchRect.width * (i === 1 || i === 2 ? 1 : 0),
                y: catchRect.top + catchRect.height * (i > 1 ? 1 : 0),
            });
        }

        return skoash.util.doIntersect(bucketCorners, catchableCorners);
    }

    selectCatchable(bucketRef, catchableRef) {
        if (!this.state.started || this.state.paused || !this.state.canCatch ||
            !this.props.canCatch || !catchableRef.canCatch()) return;
        catchableRef.markCaught();
        if (catchableRef.props.message === bucketRef.props.message) {
            this.correct(bucketRef, catchableRef);
        } else {
            this.incorrect(bucketRef, catchableRef);
        }
    }

    correct(bucketRef, catchableRef) {
        this.playMedia('correct');
        this.props.onCorrect.call(this, bucketRef, catchableRef);
    }

    incorrect(bucketRef, catchableRef) {
        this.playMedia('incorrect');
        this.props.onIncorrect.call(this, bucketRef, catchableRef);
    }

    getClassNames() {
        return classNames('catcher', super.getClassNames());
    }

    renderBucket() {
        return _.map([].concat(this.props.bucket), (bucket, key) =>
            <bucket.type
                {...bucket.props}
                ref={'buckets-' + key}
                style={this.state.styles[key]}
                key={key}
            />
        );
    }

    render() {
        return (
            <div ref="catcher" className={this.getClassNames()}>
                {this.renderContentList('assets')}
                {this.renderBucket()}
            </div>
        );
    }
}

Catcher.defaultProps = _.defaults({
    moveBuckets: false,
    onMove: _.noop,
    canCatch: true,
}, skoash.Component.defaultProps);

export default Catcher;
