import classNames from 'classnames';

class Dropzone extends skoash.Component {
    start() {
        var self = this;
        var dropzone;
        var draggable;

        super.start();

        if (this.props.clearOnStart) {
            _.each(this.props.dropzones, (value, key) => {
                var dropzoneRef;
                dropzoneRef = this.refs[`dropzone-${key}`];
                dropzoneRef.contains = [];
            });
        }

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
        var dropzoneArray;

        droppedDOM = dropped.DOMNode || ReactDOM.findDOMNode(dropped);
        corners = this.getCorners(droppedDOM);

        dropzoneArray = _.reduce(this.props.dropzones, (a, v, k) => {
            if (skoash.util.doIntersect(corners, this.dropzoneCorners[k])) {
                a.push(this.refs[`dropzone-${k}`]);
            }
            return a;
        }, []);

        if (dropzoneArray.length) {
            this.inBounds(dropped, dropzoneArray);
        } else {
            this.outOfBounds(dropped);
        }
    }

    onDrag(dragging) {
        this.playMedia('drag');
        this.removeEl(dragging);
        this.props.onDrag.call(this, dragging);
    }

    onReturn(returning) {
        this.removeEl(returning);
        this.props.onReturn.call(this, returning);
    }

    removeEl(el) {
        _.each(this.props.dropzones, (value, key) => {
            var index;
            var dropzoneRef;
            var contains;
            dropzoneRef = this.refs[`dropzone-${key}`];
            contains = dropzoneRef.contains || [];
            index = contains.indexOf(el);
            if (~index) {
                contains.splice(index, 1);
                this.props.onRemove.call(this, el, dropzoneRef);
            }
            dropzoneRef.contains = contains;
        });
    }

    inBounds(dropped, dropzoneArray) {
        let correct = _.some(dropzoneArray, dropzoneRef => {
            if (
                (!dropzoneRef.props.answers ||
                _.includes(dropzoneRef.props.answers, dropped.props.message)) &&
                dropzoneRef.contains.length < this.props.acceptNum
            ) {
                this.correct(dropped, dropzoneRef);
                return true;
            }
            return false;
        });

        if (!correct) this.incorrect(dropped, dropzoneArray);
    }

    outOfBounds(dropped) {
        // respond to an out of bounds drop
        this.playMedia('out');
        this.incorrect(dropped);
    }

    correct(dropped, dropzoneRef) {
        // respond to correct drop
        dropped.markCorrect();
        this.playMedia('correct');

        dropzoneRef.contains = (dropzoneRef.contains || []).concat(dropped);

        this.props.onCorrect.call(this, dropped, dropzoneRef);
    }

    incorrect(dropped, dropzoneArray) {
        // respond to incorrect drop
        dropped.markIncorrect();
        this.playMedia('incorrect');
        this.props.onIncorrect.call(this, dropped, dropzoneArray);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);

        if (props.dropped && props.dropped !== this.props.dropped) {
            this.onDrop(props.dropped);
        }

        if (props.dragging && props.dragging !== this.props.dragging) {
            this.onDrag(props.dragging);
        }

        if (props.returning && props.returning !== this.props.returning) {
            this.onReturn(props.returning);
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
    onReturn: _.noop,
    acceptNum: Infinity,
    clearOnStart: false,
}, skoash.Component.defaultProps);

export default Dropzone;
