import classNames from 'classnames';

const AREA = 'area';
const CONTENT = 'content';
const VISIBLE = 'VISIBLE';
const HIDDEN = 'HIDDEN';

class Slider extends skoash.Component {
    constructor(props) {
        super(props);

        this.state = _.defaults({
            firstSlide: 0,
            freezeItems: {},
        }, this.state);

        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
    }

    prev() {
        this.changeSlide(-1 * this.props.increment);
    }

    next() {
        this.changeSlide(this.props.increment);
    }

    changeSlide(increment) {
        var firstSlide;

        if (this.props.loop && this.props.display === 1) {
            firstSlide = (this.state.firstSlide + increment + this.props.children.length) %
                this.props.children.length;
        } else {
            firstSlide = Math.min(Math.max(this.state.firstSlide + increment, 0),
                this.props.children.length - this.props.display);
        }

        this.setState({
            firstSlide
        });
    }

    getClassNames() {
        return classNames('slider', super.getClassNames());
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);


        if (props.freezeItem !== null && props.freezeItem !== this.props.freezeItem) {
            let freezeItems = _.clone(this.state.freezeItems);
            let ref = props.freezeItem;

            if (this.refs[ref]) {
                let save = {};
                let position;
                save.className = this.refs[ref].DOMNode.className.includes(VISIBLE) ?
                    VISIBLE : HIDDEN;
                position = this.refs[ref].props.key - this.state.firstSlide;
                position = Math.max(-1, Math.min(this.props.display, position))
                save.className += ` position-${position}`;
                freezeItems[ref] = {};
                freezeItems[ref] = save;
            }

            this.setState({
                freezeItems,
            });
        }

        if (props.unfreezeItem !== null && props.unfreezeItem !== this.props.unfreezeItem) {
            let freezeItems = _.omit(this.state.freezeItems, props.unfreezeItem);

            this.setState({
                freezeItems,
            });
        }
    }

    renderContentList(listName = 'children') {
        var children = [].concat(this.props[listName]);
        return children.map((component, key) => {
            var ref;
            var className;
            var position;
            var freezeItem;

            if (!component) return;
            ref = component.ref || (component.props && component.props['data-ref']) || listName + '-' + key;
            className = (key >= this.state.firstSlide &&
                key < this.state.firstSlide + this.props.display) ? VISIBLE : HIDDEN;
            position = key - this.state.firstSlide;
            position = Math.max(-1, Math.min(this.props.display, position))
            className += ` position-${position}`

            if (_.includes(_.keys(this.state.freezeItems), ref)) {
                className = this.state.freezeItems[ref].className;
            }

            className = classNames(className, component.props.className);

            return (
                <component.type
                    gameState={this.props.gameState}
                    {...component.props}
                    ref={ref}
                    key={key}
                    className={className}
                />
            );
        });
    }

    render() {
        if (!this.props.shouldRender) return null;

        return (
            <this.props.type {...this.props} className={this.getClassNames()}>
                <button className="prev-slide" onClick={this.prev} />
                <div className={AREA}>
                    <div className={CONTENT}>
                        {this.renderContentList()}
                    </div>
                </div>
                <button className="next-slide" onClick={this.next} />
            </this.props.type>
        );
    }
}

Slider.defaultProps = _.defaults({
    loop: true,
    display: 1,
    increment: 1,
}, skoash.Component.defaultProps);

export default Slider;
