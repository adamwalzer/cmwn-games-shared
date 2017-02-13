import Reveal from '../reveal/0.1.js';
import Catch from '../catch/0.1.js';

class CatchableReveal extends skoash.Component {
    constructor() {
        super();
        this.state = {
            caughtCount: 0
        };
    }

    onCorrect(catchableNode, key) {
        var willReveal = this.props.willReveal.call(this, catchableNode, key);
        this.setState({caughtCount: this.state.caughtCount + 1});
        if (this.props.answers.length) {
            if (this.props.answers.indexOf(key) === -1) {
                this.playMedia('incorrect');
            } else {
                if (willReveal && typeof this.refs.reveal.open === 'function') {
                    this.openReveal(key);
                }
            }
        } else {
            if (willReveal && typeof this.refs.reveal.open === 'function') {
                this.openReveal(key);
            }
        }
    }

    openReveal(message) {
        var revealMessage;
        this.refs.catch.setState({canCatch: false});
        this.playMedia('correct');
        revealMessage = typeof this.props.getMessage === 'function' ?
            this.props.getMessage.call(this, message) : message;
        this.refs.reveal.open(revealMessage);
    }

    closeRespond() {
        window.setTimeout(() => {
            this.refs.catch.setState({canCatch: true});
        }, 1500);
        if (typeof this.props.closeRespond === 'function') {
            this.props.closeRespond();
        }
    }

    renderAssets() {
        if (this.props.assets) {
            return this.props.assets.map((asset, key) => {
                return (
                    <skoash.Audio
                        {...asset.props}
                        ref={asset.props['data-ref'] || ('asset-' + key)}
                        key={key}
                        data-ref={key}
                    />
                );
            });
        }

        return null;
    }

    renderCatchable() {
        return (
            <Catch
                ref="catch"
                bucket={this.props.bucket}
                catchables={this.props.catchables}
                onCorrect={this.onCorrect.bind(this)}
                isComplete={true}
            />
        );
    }

    renderReveal() {
        return (
            <Reveal
                ref="reveal"
                list={this.props.revealList}
                assets={this.props.revealAssets}
                closeRespond={this.closeRespond.bind(this)}
            />
        );
    }

    getClasses() {
        var classes = '';

        if (this.state.complete) classes += ' COMPLETE';

        return classes;
    }

    render() {
        return (
            <div className={'catchable-reveal' + this.getClasses()}>
                {this.renderAssets()}
                {this.renderCatchable()}
                {this.renderReveal()}
            </div>
        );
    }
}

CatchableReveal.defaultProps = _.defaults({
    answers: [],
    willReveal: () => true
}, skoash.Component.defaultProps);

export default CatchableReveal;
