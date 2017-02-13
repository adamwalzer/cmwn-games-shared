import Catch from 'shared/components/catch/0.1';

class Catcher extends Catch {
    bootstrap() {
        skoash.Component.prototype.bootstrap.call(this);
        window.addEventListener('resize', this.onResize);
        this.onResize();
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
        var xCenter = catchRect.left + (catchRect.right - catchRect.left) / 2;
        var yOffset = (catchRect.bottom - catchRect.top) * this.props.collideFraction;
        return (bucketRect.top < catchRect.bottom - yOffset && bucketRect.top > catchRect.top + yOffset &&
            xCenter > bucketRect.left && xCenter < bucketRect.right);
    }

    selectCatchable(bucketRef, catchableRef) {
        var catchableRefKey;
        if (!this.state.started || this.state.paused ||
            !this.state.canCatch || !catchableRef.canCatch()) return;
        catchableRefKey = catchableRef.props['data-ref'];
        this.updateScreenData({
            keys: [this.props.caughtTarget, 'caught'],
            data: catchableRefKey,
        });
        if (catchableRef.props.message === bucketRef.props.message) {
            this.correct(bucketRef, catchableRefKey);
        } else {
            this.incorrect(bucketRef, catchableRefKey);
        }
    }

    correct(bucketRef, catchableRefKey) {
        this.playMedia('correct');
        this.props.onCorrect.call(this, bucketRef, catchableRefKey);
    }

    incorrect(bucketRef, catchableRefKey) {
        this.playMedia('incorrect');
        this.props.onIncorrect.call(this, bucketRef, catchableRefKey);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);

        if (props.pause && props.pause !== this.props.pause) {
            this.pause();
        }

        if (props.resume && props.resume !== this.props.resume) {
            this.resume();
        }
    }

    renderBucket() {
        return _.map([].concat(this.props.bucket), (bucket, key) =>
            <bucket.type
                {...bucket.props}
                ref={'buckets-' + key}
                style={this.getStyle()}
                key={key}
            />
        );
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                {this.renderContentList('assets')}
                {this.renderBucket()}
            </div>
        );
    }
}

Catcher.defaultProps = _.defaults({
    caughtTarget: 'catcher',
    collideFraction: 1 / 6,
}, Catch.defaultProps);

export default Catcher;
