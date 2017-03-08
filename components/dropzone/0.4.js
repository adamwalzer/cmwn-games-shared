import classNames from 'classnames';

class Dropzone extends skoash.Component {
    start() {
        var self = this;
        var dropzone;
        var draggable;

        super.start();

        self.dropzoneCorners = _.map(self.props.dropzones, (value, key) =>
            self.getCorners(ReactDOM.findDOMNode(self.refs[`dropzone-${key}`]))
        );

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

    getCorners(el) {
        var offset;
        var corners = [];

        offset = el.getBoundingClientRect();

        for (let i = 0; i < 4; i++) {
            corners.push({
                x: offset.left + offset.width * (i === 1 || i === 2 ? 1 : 0),
                y: offset.top + offset.height * (i > 1 ? 1 : 0),
            });
        }

        return corners;
    }

    onDrop(dropped) {
        var droppedDOM;
        var corners;
        var dropzoneRef;

        droppedDOM = dropped.DOMNode || ReactDOM.findDOMNode(dropped);
        corners = this.getCorners(droppedDOM);

        dropzoneRef = _.reduce(this.props.dropzones, (a, v, k) => {
            if (skoash.util.doIntersect(corners, this.dropzoneCorners[k])) {
                return this.refs[`dropzone-${k}`];
            }
            return a;
        }, false);

        if (dropzoneRef) {
            this.inBounds(dropped, dropzoneRef);
        } else {
            this.outOfBounds(dropped);
        }

        this.props.onDrop.call(this, dropped);
    }

    onDrag(dragging) {
        _.each(this.props.dropzones, (value, key) => {
            var index;
            var dropzoneRef;
            var contains;
            dropzoneRef = this.refs[`dropzone-${key}`];
            contains = dropzoneRef.contains || [];
            index = contains.indexOf(dragging);
            if (~index) contains.splice(index, 1);
            dropzoneRef.contains = contains;
        });

        this.playMedia('drag');
        this.props.onDrag.call(this, dragging);
    }

    inBounds(dropped, dropzoneRef) {
        if (!dropzoneRef.props.answers || dropzoneRef.props.answers.indexOf(dropped.props.message) !== -1) {
            this.correct(dropped, dropzoneRef);
        } else {
            this.incorrect(dropped, dropzoneRef);
        }
    }

    outOfBounds(dropped) {
        // respond to an out of bounds drop
        this.playMedia('out');
        if (this.props.incorrectOnOutOfBounds) this.incorrect(dropped);
    }

    correct(dropped, dropzoneRef) {
        // respond to correct drop
        dropped.markCorrect();
        this.playMedia('correct');

        dropzoneRef.contains = (dropzoneRef.contains || []).concat(dropped);

        this.props.onCorrect.call(this, dropped, dropzoneRef);
    }

    incorrect(dropped, dropzoneRef) {
        // respond to incorrect drop
        dropped.markIncorrect();
        this.playMedia('incorrect');
        this.props.onIncorrect.call(this, dropped, dropzoneRef);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);

        if (props.dropped && props.dropped !== this.props.dropped) {
            this.onDrop(props.dropped);
        }

        if (props.dragging && props.dragging !== this.props.dragging) {
            this.onDrag(props.dragging);
        }
    }

    renderDropzones() {
        return _.map(this.props.dropzones, (component, key) =>
            <component.type
                {...component.props}
                ref={`dropzone-${key}`}
                key={key}
            />
        );
    }

    getClassNames() {
        return classNames('dropzones', super.getClassNames());
    }

    render() {
        return (
            <div {...this.props} className={this.getClassNames()}>
                {this.renderContentList('assets')}
                {this.renderDropzones()}
            </div>
        );
    }
}

Dropzone.defaultProps = _.defaults({
    dropzones: [<skoash.Component />],
    onCorrect: _.noop,
    onIncorrect: _.noop,
    onDrag: _.noop,
    onDrop: _.noop,
    incorrectOnOutOfBounds: true,
}, skoash.Component.defaultProps);

export default Dropzone;
