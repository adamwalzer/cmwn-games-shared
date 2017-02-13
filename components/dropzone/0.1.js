import _ from 'lodash';
import classNames from 'classnames';

import Draggable from '../draggable/0.1.js';

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

        this.moreDraggables = [];

        this.contains = [];

        this.dropRespond = this.dropRespond.bind(this);
        this.dragRespond = this.dragRespond.bind(this);

        this.state = {
            dropped: [],
        };
    }

    bootstrap() {
        var answerRefs = [];
        var self = this;

        super.bootstrap();

        this.props.dropzones.forEach(item => {
            if (item.props.answers) {
                answerRefs = answerRefs.concat(item.props.answers.map(answer => { return '' + answer; }));
            }
        });

        if (answerRefs.length > 0) {
            self.requireForComplete.forEach(item => {
                if (answerRefs.indexOf(item) === -1) self.refs[item].complete();
            });
        }

        this.answerRefs = answerRefs;
    }

    incomplete() {
        this.setState({
            dropped: [],
        });

        super.incomplete();

        if (this.answerRefs.length > 0) {
            this.requireForComplete.forEach(item => {
                if (this.answerRefs.indexOf(item) === -1) this.refs[item].complete();
            });
        }
    }

    prepareDropzones() {
        var self = this;

        this.props.dropzones.map((dropzone, key) => {
            var dropzoneRef = this.refs[`dropzone-${key}`];
            var dropzoneDOM = ReactDOM.findDOMNode(dropzoneRef);
            if (dropzoneDOM) {
                dropzoneRef.corners = self.getCorners(dropzoneDOM);
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
        this.moreDraggables = this.props.moreDraggables || this.moreDraggables;
    }

    start() {
        super.start();
        this.prepareDropzones();
    }

    dragRespond(message) {
        this.playMedia('drag');

        if (typeof this.props.dragRespond === 'function') {
            this.props.dragRespond.call(this, message);
        }
    }

    dropRespond(message, corners) {
        var self = this;
        var isInBounds;

        isInBounds = self.props.dropzones.some((dropzone, key) => {
            var dropzoneRef = self.refs[`dropzone-${key}`];
            if (skoash.util.doIntersect(corners, dropzoneRef.corners)) {
                self.inBounds(message, key);
                return true;
            }
            return false;
        });

        if (!isInBounds) self.outOfBounds(message);
    }

    inBounds(message, dropzoneKey) {
        var dropzoneRef = this.refs[`dropzone-${dropzoneKey}`];
        if (!dropzoneRef.props.answers || dropzoneRef.props.answers.indexOf(message) !== -1) {
            this.correct(message, dropzoneKey);
        } else {
            this.incorrect(message);
        }
        this.refs[message].complete();
    }

    outOfBounds(message) {
    // respond to out of bounds drop
        this.refs[message].returnToStart();

        this.playMedia('out');
    }

    correct(message, dropzoneKey) {
    // respond to correct drop

        var dropped = this.state.dropped;
        dropped = dropped.concat('dropped-' + message);
        this.setState({
            dropped,
        });

        this.playMedia('correct');

        this.refs[message].markCorrect();

        if (typeof this.props.correctRespond === 'function') {
            this.props.correctRespond.call(this, message, dropzoneKey);
        }
    }

    incorrect(message) {
    // respond to incorrect drop
        this.playMedia('incorrect');

        if (typeof this.props.incorrectRespond === 'function') {
            this.props.incorrectRespond.call(this, message);
        }
    }

    renderAssets() {
        if (this.props.assets) {
            return this.props.assets.map((asset, key) =>
                <skoash.Audio
                    {...asset.props}
                    ref={asset.props['data-ref'] || ('asset-' + key)}
                    key={key}
                    data-ref={key}
                />
            );
        }

        return null;
    }

    renderDropzones() {
        return this.props.dropzones.map((component, key) =>
            <component.type
                {...component.props}
                className={this.getClass()}
                ref={`dropzone-${key}`}
                key={key}
                checkComplete={false}
            />
        );
    }

    renderDraggables(draggables) {
        return this.props[draggables].map((item, key) => {
            var message = item.props.message || key;
            return (
                <li key={key} className={this.getDraggableClass(message)}>
                    <Draggable
                        {...item.props}
                        ref={message}
                        message={message}
                        key={key}
                        dragRespond={this.dragRespond}
                        dropRespond={this.dropRespond}
                        checkComplete={false}
                    />
                </li>
            );
        });
    }

    getDraggableClass(message) {
        var classes = '';
        if (this.state.dropped.indexOf(message) !== -1) {
            classes += 'DROPPED';
        }
        return classes;
    }

    getClass() {
        return classNames(
      'dropzone',
      this.state.dropped,
    );
    }

    renderMoreDraggables() {
        return this.moreDraggables.map((item, key) =>
      <li key={key}>
        <Draggable
          {...item.props}
          dragRespond={this.dragRespond}
          dropRespond={this.dropRespond}
        />
      </li>
    );
    }

    getClassNames() {
        return classNames(
      'dropzone-container',
      super.getClassNames(),
    );
    }

    render() {
        var draggablesLeft;
        var draggablesRight;
        var left;

        left = this.props.draggablesLeft ? 'draggablesLeft' : 'draggables';
        if (this.props[left]) {
            draggablesLeft = (
        <ul>
          {this.renderDraggables(left)}
        </ul>
      );
        }
        if (this.props.draggablesRight) {
            draggablesRight = (
        <ul>
          {this.renderDraggables('draggablesRight')}
        </ul>
      );
        }
        return (
            <div className={this.getClassNames()}>
                {this.renderAssets()}
                {draggablesLeft}
                {this.renderDropzones()}
                {draggablesRight}
            </div>
        );
    }
}

export default Dropzone;


Dropzone.defaultProps = _.defaults({
    dropzones: [
        <skoash.Component answers="drag" />
    ],
    draggables: [
        <Draggable message={'drag'}>drag me!</Draggable>,
        <Draggable message={'return'} return={true} >return</Draggable>
    ],
}, skoash.Component.defaultProps);

