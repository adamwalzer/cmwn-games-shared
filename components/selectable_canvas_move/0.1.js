import classNames from 'classnames';

import SelectableCanvas from 'shared/components/selectable_canvas/0.2';

var Item = function (component, context) {
    this.position = {
        x: component.props.x,
        y: component.props.y,
    };
    this.margin = 0;
    this.left = 0;
    this.selected = false;
    this.speed = ((Math.random() * 5) % 3 + 2) / 2;

    this.component = component;
    this.image = ReactDOM.findDOMNode(component);

    this.context = context;

    this.backgroundSize = {
        width: 200,
        height: 200
    };
    this.size = {
        width: 360,
        height: 460
    };

    this.render = function () {
        this.context.drawImage(
            this.image,
            this.left,
            this.component.props.backgroundRow * this.image.naturalHeight / 15,
            this.size.width,
            this.size.height,
            this.position.x,
            this.position.y,
            this.backgroundSize.width,
            this.backgroundSize.height
        );
    };

    this.hover = function () {
        if (!this.selected) this.left = this.image.naturalWidth / 3;
    };

    this.unhover = function () {
        if (!this.selected) this.left = 0;
    };

    this.select = function () {
        this.selected = true;
        this.left = this.image.naturalWidth * 2 / 3;
    };

    this.deselect = function () {
        this.selected = false;
        this.left = 0;
    };

    // this.is = function (_type) {
    //   return $(this.image).is(_type);
    // };

    // this.id = function () {
    //   return this.$image.id();
    // };

    return this;
};

class SelectableCanvasMove extends SelectableCanvas {
    constructor() {
        super();

        this.state = {
            classes: {},
            selectFunction: this.highlight,
        };

        this.move = this.move.bind(this);
        this.onHover = this.onHover.bind(this);
    }

    bootstrap() {
        skoash.Selectable.prototype.bootstrap.call(this);

        this.buffer = document.createElement('canvas');

        this.el = ReactDOM.findDOMNode(this);

        this.setDimensions();

        this.bctx = this.buffer.getContext('2d');
        this.context = this.refs.canvas.getContext('2d');

        this.items = [];

        _.forIn(this.refs, item => {
            if (!(item instanceof skoash.Image)) return;
            this.items.push(new Item(item, this.context));
        });

        this.itemsReverse = _.reverse(_.clone(this.items));
    }

    setDimensions() {
        this.refs.canvas.width = this.el.offsetWidth;
        this.refs.canvas.height = this.el.offsetHeight;
        this.buffer.width = this.el.offsetWidth;
        this.buffer.height = this.el.offsetHeight;
    }

    componentDidUpdate() {
        this.setDimensions();
    }

    start() {
        super.start();

        this.isRunning = true;
        window.requestAnimationFrame(this.move);
        _.each(this.items, item => item.deselect());
    }

    move() {
        this.context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
        _.each(this.items, item => {
            var y;
            var height;
            item.position.y -= item.speed;

            y = item.position.y + item.margin;
            height = item.size.height;

            if (y + height < 0) item.position.y = this.el.offsetHeight * 1.1;

            item.render();
        });

        if (this.isRunning) window.requestAnimationFrame(this.move);
    }

    selectHelper(e, classes) {
        var target;
        this.itemsReverse.some((item, key) => {
            if (this.isImageTarget(item, e)) {
                item.select();
                target = item.component;
                target.complete();
                classes[key] = this.props.selectClass;
                return true;
            }

            return false;
        });

        this.setState({
            classes,
        });

        this.props.onSelect.call(this, target);

        this.checkComplete();
    }

    onHover(e) {
        this.itemsReverse.forEach(item => {
            item.unhover();
        });

        this.itemsReverse.some((item) => {
            if (this.isImageTarget(item, e)) {
                item.hover();
                return true;
            }
            return false;
        });
    }

    isImageTarget(item, e) {
        var pixel;

        this.bctx.clearRect(0, 0, this.buffer.width, this.buffer.height);
        this.bctx.drawImage(
            item.image,
            item.left,
            item.component.props.backgroundRow * item.image.naturalHeight / 15,
            item.size.width,
            item.size.height,
            item.position.x,
            item.position.y,
            item.backgroundSize.width,
            item.backgroundSize.height
        );
        pixel = this.bctx.getImageData(e.pageX, e.pageY, 1, 1);

        this.bctx.fillStyle = 'blue';
        this.bctx.fillRect(e.pageX, e.pageY, 5, 5);

    // opaque pixel
        return pixel.data[3] > 0;
    }

    getClassNames() {
        return classNames('selectable-canvas-move', super.getClassNames());
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                <div className="items hidden">
                    {this.renderContentList('items')}
                </div>
                <canvas
                    ref="canvas"
                    onClick={this.state.selectFunction.bind(this)}
                    onMouseMove={this.onHover}
                />
            </div>
        );
    }
}

SelectableCanvasMove.defaultProps = _.defaults({
    items: [],
    onSelect: _.noop,
}, SelectableCanvas.defaultProps);

export default SelectableCanvasMove;
