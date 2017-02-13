// As of skoash 1.1.0 this component can be found at skoash.Repeater
/* eslint-disable no-console */
console.warn('As of skoash 1.1.0 this component can be found at skoash.Repeater');
/* eslint-enable no-console */

class Repeater extends skoash.Component {
    renderContentList() {
        var a = [];
        for (let i = 0; i < this.props.amount; i++) {
            a.push(
                <this.props.item.type
                    key={i}
                    {...this.props.item.props}
                    {...this.props.props[i]}
                />
            );
        }
        return a;
    }
}

Repeater.defaultProps = _.defaults({
    amount: 1,
    item: <div />,
    props: [],
}, skoash.Component.defaultProps);

export default Repeater;
