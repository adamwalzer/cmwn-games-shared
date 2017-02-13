class Repeater extends skoash.Component {
    renderContentList() {
        var a = [];
        for (let i = 0; i < this.props.amount; i++) {
            a.push(<this.props.item key={i} {...this.props.props[i]} />);
        }
        return a;
    }
}

Repeater.defaultProps = _.defaults({
    amount: 1,
    item: 'div',
    props: [],
}, skoash.Component.defaultProps);

export default Repeater;
