import classNames from 'classnames';

import Component from 'components/component';

const AREA = 'area';
const CONTENT = 'content';
const HORIZONTAL = 'horizontal';
const VISIBLE = 'VISIBLE';
const HIDDEN = 'HIDDEN';

class Slider extends Component {
    constructor(props) {
        super(props);

        this.state = _.defaults({
            firstSlide: 0,
            freezeItems: {},
        }, this.state);

        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.getContentStyle = this.getContentStyle.bind(this);
    }

    prev() {
        this.changeSlide(-1 * this.props.increment);
    }

    next() {
        this.changeSlide(this.props.increment);
    }

    componentDidUpdate() {
        if (this.props.orientation === HORIZONTAL) {
            this.adjust = document.getElementsByClassName('slider')[0]
                .getElementsByClassName(CONTENT)[0].clientWidth;
        } else {
            this.adjust = document.getElementsByClassName('slider')[0]
                .getElementsByClassName(CONTENT)[0].clientHeight;
        }
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

    getContentStyle() {
        if (this.props.orientation === HORIZONTAL) {
            return {
                marginLeft: this.state.firstSlide * this.adjust * -1 + 'px'
            };
        } else {
            return {
                marginTop: this.state.firstSlide * this.adjust * -1 + 'px'
            };
        }
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
                save.className = this.refs[ref].DOMNode.className.includes(VISIBLE) ?
                    VISIBLE : HIDDEN;
                save.firstSlide = this.state.firstSlide;
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
            var style = {};
            var freezeItem;
            var freezeItemStyle;
            var margin;

            if (!component) return;
            ref = component.ref || (component.props && component.props['data-ref']) || listName + '-' + key;
            position = this.props.orientation === HORIZONTAL ? 'left' : 'top';
            style[position] = (key * 100) + '%';
            className = (key >= this.state.firstSlide &&
                key < this.state.firstSlide + this.props.display) ? VISIBLE : HIDDEN;

            if (_.includes(_.keys(this.state.freezeItems), ref)) {
                freezeItem = _.clone(this.state.freezeItems[ref]);
                freezeItemStyle = {};
                margin = `margin${_.upperFirst(position)}`;
                freezeItemStyle[margin] = (
					(this.state.firstSlide - freezeItem.firstSlide) * this.adjust
				) + 'px';
                style = _.defaults(freezeItemStyle, style);
                className = freezeItem.className;
            }

            className = classNames(className, component.props.className);

            return (
                <component.type
                    gameState={this.props.gameState}
                    {...component.props}
                    ref={ref}
                    key={key}
                    style={style}
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
                    <div
                        className={CONTENT}
                        style={this.getContentStyle()}
                    >
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
    orientation: HORIZONTAL,
    increment: 1,
}, Component.defaultProps);

export default Slider;
