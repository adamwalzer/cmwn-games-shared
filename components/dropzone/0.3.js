import _ from 'lodash';
import classNames from 'classnames';

import Draggable from '../draggable/0.3.js';

class Dropzone extends skoash.Component {
    constructor() {
        super();

        this.dropzones = [
            <skoash.Component answers="drag" />
        ];

        this.draggables = [
            <Draggable message={'drag'}>drag me!</Draggable>,
            <Draggable message={'return'} return={true} >return</Draggable>
        ];

        this.contains = [];

        this.dropRespond = this.dropRespond.bind(this);
        this.dragRespond = this.dragRespond.bind(this);
    }

    prepareDropzones() {
        var self = this;

        self.dropzones.map((dropzone, key) => {
            var dropzoneRef = this.refs[`dropzone-${key}`];
            if (dropzoneRef) {
                dropzoneRef.corners = self.getCorners(ReactDOM.findDOMNode(dropzoneRef));
            }
        });
    }

    getCorners(el) {
        var top;
        var left;
        var width;
        var height;
        var corners = [];

        left = 0;
        top = 0;
        width = el.offsetWidth;
        height = el.offsetHeight;

        while (el) {
            if (el.className && el.className.indexOf('screen') !== -1) {
                break;
            }

            left += el.offsetLeft || 0 ;
            top += el.offsetTop || 0;
            el = el.offsetParent;
        }
        for (let i = 0; i < 4; i++) {
            corners.push({
                x: left + width * (i === 1 || i === 2 ? 1 : 0),
                y: top + height * (i > 1 ? 1 : 0),
            });
        }

        return corners;
    }

    componentWillMount() {
        this.dropzones = this.props.dropzones || this.dropzones;
        this.draggables = this.props.draggables || this.draggables;
    }

    start() {
        var self = this;
        super.start();
        this.prepareDropzones();

        if (self.loadData && typeof self.loadData === 'object') {
            if (!this.state.loadedData) {
                this.setState({
                    loadingData: true
                }, () => {
                    _.forIn(self.loadData, (ref, key) => {
                        if (ref.ref && ref.state) {
                            this.loadDragNDropData(ref, key);
                        } else {
                            this.loadMultiAnswerData(ref, key);
                        }
                    });

                    this.setState({
                        loadingData: false,
                        loadedData: true
                    });
                });
            }

            this.updateGameState({
                path: 'game',
                data: {
                    complete: true
                }
            });
        }
    }

    loadDragNDropData(ref, key) {
        var dropzone;
        var draggable;
        _.forIn(this.refs, (ref2, key2) => {
            if (key2.indexOf('draggable-') === -1) return;
            if (this.refs[key] && ref2.props.message === ref.ref) {
                dropzone = this.refs[key];
                draggable = ref2;
                dropzone.setState({
                    content: draggable
                });
                draggable.setState(ref.state);
                this.correct(draggable, key.replace('dropzone-', ''));
            }
        });
    }

    loadMultiAnswerData(ref, key) {
        var draggable;
        _.forIn(this.refs, (ref2, key2) => {
            if (key2.indexOf('draggable-') === -1) return;
            if (_.includes(ref, ref2.props.message)) {
                draggable = ref2;
                this.correct(draggable, key.replace('dropzone-', ''));
            }
        });
    }

    dragRespond(draggable) {
        if (!this.state.loadingData) {
            this.playMedia('drag');
        }

        if (typeof this.props.dragRespond === 'function') {
            this.props.dragRespond.call(this, draggable);
        }
    }

    dropRespond(draggable, corners) {
        var self = this;
        var isInBounds;
        isInBounds = self.dropzones.some((dropzone, key) => {
            var dropzoneRef = self.refs[`dropzone-${key}`];
            if (skoash.util.doIntersect(corners, dropzoneRef.corners)) {
                self.inBounds(draggable, key);
                return true;
            }
            return false;
        });

        if (!isInBounds) self.outOfBounds(draggable);
    }

    inBounds(draggable, dropzoneKey) {
        var dropzoneRef;
        if (this.refs && this.refs[`dropzone-${dropzoneKey}`]) {
            dropzoneRef = this.refs[`dropzone-${dropzoneKey}`];
            if (!dropzoneRef.props.answers ||
                dropzoneRef.props.answers.indexOf(draggable.props.message) !== -1) {
                this.correct(draggable, dropzoneKey);
            } else {
                this.incorrect(draggable);
            }
        }
    }

    outOfBounds(draggable) {
        // respond to out of bounds drop
        this.playMedia('out');
        this.incorrect(draggable);
    }

    correct(draggable, dropzoneKey) {
        // respond to correct drop
        draggable.markCorrect();

        if (!this.state.loadingData) {
            this.playMedia('correct');
        }

        if (this.props.centerOnCorrect) {
            this.center(draggable, dropzoneKey);
        }
        if (typeof this.props.correctRespond === 'function') {
            this.props.correctRespond.call(this, draggable, dropzoneKey);
        }
    }

    center(draggable, dropzoneKey) {
        var dropzone;
        var endX;
        var endY;
        dropzone = this.refs[`dropzone-${dropzoneKey}`];
        if (draggable.state.endX && draggable.state.endY && draggable.state.corners) {
            // position draggable at 0 0 of screen
            endX = draggable.state.endX - draggable.state.corners[0].x;
            endY = draggable.state.endY - draggable.state.corners[0].y;
            // move element 0 0 to 0 0 of dropzone
            endX += dropzone.corners[0].x;
            endY += dropzone.corners[0].y;
            // move element 0 0 to 50% 50% of dropzone
            endX += (dropzone.corners[1].x - dropzone.corners[0].x) / 2;
            endY += (dropzone.corners[3].y - dropzone.corners[0].y) / 2;
            // move element by 50% 50% of self
            endX -= (draggable.state.corners[1].x - draggable.state.corners[0].x) / 2;
            endY -= (draggable.state.corners[3].y - draggable.state.corners[0].y) / 2;

            draggable.setEnd(endX, endY);
        }
    }

    incorrect(draggable) {
    // respond to incorrect drop
        draggable.markIncorrect();
        this.playMedia('incorrect');
    }

    renderAssets() {
        if (this.props.assets) {
            return this.props.assets.map((asset, key) =>
                <asset.type
                    {...asset.props}
                    ref={asset.ref || asset.props['data-ref'] || ('asset-' + key)}
                    key={key}
                    data-ref={key}
                />
            );
        }

        return null;
    }

    renderDropzones() {
        return this.dropzones.map((component, key) =>
            <component.type
                {...component.props}
                className={this.getClassNames(component)}
                checkComplete={false || this.props.checkComplete}
                ref={`dropzone-${key}`}
                key={key}
            />
        );
    }

    renderDraggables() {
        return this.draggables.map((item, key) =>
            <li key={key}>
                <Draggable
                    {...item.props}
                    ref={'draggable-' + key}
                    dragRespond={this.dragRespond}
                    dropRespond={this.dropRespond}
                />
            </li>
        );
    }

    getClassNames(dropzone) {
        return classNames('dropzone', dropzone.props.className, super.getClassNames());
    }

    render() {
        return (
            <div>
                {this.renderAssets()}
                {this.renderDropzones()}
                <ul>
                    {this.renderDraggables()}
                </ul>
            </div>
        );
    }
}

export default Dropzone;
