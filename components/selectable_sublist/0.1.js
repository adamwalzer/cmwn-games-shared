import classNames from 'classnames';

const FORWARD = true;
const BACKWARD = false;

class SelectableSubList extends skoash.Selectable {
    constructor(props) {
        super(props);

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);

        this.state = {
            frontPos = 0;
            endPos = showNum;
        };
    }

    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);

        if (nextProps.next && nextProps.next !== this.props.next) {
            this.shiftList(FORWARD);
        }

        if (nextProps.prev && nextProps.prev !== this.props.prev) {
            this.shiftList(BACKWARD);
        }
    }

    shiftList(forward) {
        let classes = this.state.classes;
        let frontPos = this.state.frontPos;
        let endPos = this.state.endPos;

        if (forward && endPos === (this.props.list.length - 1)) return;
        if (!forward && frontPos === 0) return;

        if (forward) {
            frontPos++;
            endPos++;
        } else {
            frontPos--;
            endPos--;
        }

        classes = _.map(classes, (value, key) => {
            if (key < frontPos || key > endPos) return 'HIDE';
            return `position-${key - frontPos}`
        });

        this.setState({
            classes,
            frontPos,
            endPos,
        });
    }

    getClassNames() {
        return classNames('selectable-sublist', {
                [`front-${this.state.frontPos}`]: true,
            }, super.getClassNames());
    }
}

export default SelectableSublist;
