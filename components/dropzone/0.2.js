import _ from 'lodash';
import classNames from 'classnames';

import Draggable from '../draggable/0.2.js';

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

            left += el.offsetLeft || 0;
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
        var dropzone;
        var draggable;
        super.start();
        this.prepareDropzones();

        if (self.loadData && typeof self.loadData === 'object') {
            _.forIn(self.loadData, (ref1, key1) => {
                if (ref1.ref && ref1.state) {
                    _.forIn(self.refs, (ref2, key2) => {
                        if (key2.indexOf('draggable-') === -1) return;
                        if (self.refs[key1] && ref2.props.message === ref1.ref) {
                            dropzone = self.refs[key1];
                            draggable = ref2;
                            dropzone.setState({content: draggable});
                            draggable.setState(ref1.state);
                            self.correct(draggable, key1.replace('dropzone-', ''));
                        }
                    });
                } else {
                    _.forIn(self.loadData, (ref2, key2) => {
                        self.refs[key2].setState({content: []});
                        _.forIn(self.refs, (ref3, key3) => {
                            if (key3.indexOf('draggable-') === -1) return;
                            if (_.includes(ref2, ref3.props.message)) {
                                self.refs[key2].state.content.push(ref3);
                                ref3.markCorrect();
                            }
                        });
                    });
                }
            });
        }
    }

    loadDragNDropData() {
        var self = this;
        var dropzone;
        var draggable;
        _.forIn(self.loadData, (ref1, key1) => {
            _.forIn(self.refs, (ref2, key2) => {
                if (key2.indexOf('draggable-') === -1) return;
                if (self.refs[key1] && ref2.props.message === ref1.ref) {
                    dropzone = self.refs[key1];
                    draggable = ref2;
                    dropzone.setState({content: draggable});
                    draggable.setState(ref1.state);
                    self.correct(draggable, key1.replace('dropzone-', ''));
                }
            });
        });
    }

    loadMultiAsnwerData() {
        var self = this;
        var dropzone;
        var draggable;
        _.forIn(self.loadData, (ref1, key1) => {
            dropzone = self.refs[key1];
            dropzone.setState({content: []});
            _.forIn(self.refs, (ref2, key2) => {
                if (key2.indexOf('draggable-') === -1) return;
                draggable = ref2;
                if (_.includes(ref1, draggable.props.message)) {
                    dropzone.state.content.push(draggable);
                    draggable.markCorrect();
                }
            });
        });
    }

    dragRespond(draggable) {
        this.playMedia('drag');

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
        var dropzoneRef = this.refs[`dropzone-${dropzoneKey}`];
        if (!dropzoneRef.props.answers || dropzoneRef.props.answers.indexOf(draggable.props.message) !== -1) {
            this.correct(draggable, dropzoneKey);
        } else {
            this.incorrect(draggable);
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
        this.playMedia('correct');
        if (typeof this.props.correctRespond === 'function') {
            this.props.correctRespond.call(this, draggable, dropzoneKey);
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
                className={this.getClassNames()}
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

    getClassNames() {
        return classNames('dropzone', super.getClassNames());
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
