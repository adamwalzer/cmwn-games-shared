// As of skoash 1.1.2 this component can be found at skoash.Randomizer
/* eslint-disable no-console */
console.warn('As of skoash 1.1.2 this component can be found at skoash.Randomizer');
/* eslint-enable no-console */

import classNames from 'classnames';

class Randomizer extends skoash.Component {
    getAll() {
        return _.shuffle(this.props.bin);
    }

    get(amount = 1) {
        var items;
        var bin = [];

        if (this.props.remain && this.state.bin) {
            bin = this.state.bin;
        }

        while (bin.length < amount) {
            bin = bin.concat(_.shuffle(this.props.bin));
        }

        items = bin.splice(0, amount);

        if (this.props.remain) {
            this.setState({bin});
        }

        return items;
    }

    getClassNames() {
        return classNames('randomizer', super.getClassNames());
    }

    renderBin() {
        return _.map(this.props.bin, (li, key) => {
            var ref = li.ref || (li.props && li.props['data-ref']) || key;
            return (
                <li.type
                    {...li.props}
                    data-ref={ref}
                    ref={ref}
                    key={key}
                />
            );
        });
    }

    render() {
        return (
            <ul className={this.getClassNames()}>
                {this.renderBin()}
            </ul>
        );
    }
}

Randomizer.defaultProps = _.defaults({
    bin: [],
    remain: false,
    shouldComponentUpdate: () => false,
}, skoash.Component.defaultProps);

export default Randomizer;
