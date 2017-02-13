import Selectable from 'shared/components/selectable/0.1.js';
import Reveal from 'shared/components/reveal/0.1.js';

class SelectableReveal extends skoash.Component {
    constructor() {
        super();
    }

    start() {
        super.start();
        this.setState({
            canSelectOnStart: this.props.canSelectOnStart
        });
    }

    open(message) {
        this.refs.reveal.open(message);
    }

    selectRespond(message) {
        if (this.props.answers.length) {
            if (this.props.answers.indexOf(message) === -1) {
                this.playMedia('incorrect');
                if (this.props.revealAll) {
                    if (typeof this.refs.reveal.open === 'function') {
                        this.open(message);
                    }
                }
            } else {
                this.playMedia('correct');
                if (typeof this.refs.reveal.open === 'function') {
                    this.open(message);
                }
            }
        } else {
            if (this.props.allCorrect) this.playMedia('correct');
            if (typeof this.refs.reveal.open === 'function') {
                this.open(message);
            }
        }
    }

    closeRespond() {
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
                        ref={asset.ref || asset.props['data-ref'] || ('asset-' + key)}
                        key={key}
                        data-ref={key}
                    />
                );
            });
        }

        return null;
    }

    renderSelectable() {
        return (
            <Selectable
                ref="selectable"
                list={this.props.selectableList}
                selectRespond={this.selectRespond.bind(this)}
                selectClass={this.props.selectableSelectClass}
                completeOnSelect={this.props.selectableCompleteOnSelect}
                checkComplete={this.props.selectableCheckComplete}
                randomizeList={this.props.randomizeSelectableList}
                selectOnStart={this.props.selectOnStart}
                chooseOne={this.props.chooseOne}
                answers={this.props.answers}
                allowDeselect={this.props.allowDeselect}
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
                completeOnOpen={this.props.revealCompleteOnOpen}
                checkComplete={this.props.revealCheckComplete}
                openOnStart={this.props.openOnStart}
                hide={this.props.hideReveal}
                openReveal={this.props.openReveal}
                onOpen={this.props.onOpen}
                openMultiple={false}
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
            <div className={'selectable-reveal' + this.getClasses()}>
                {this.renderAssets()}
                {this.renderSelectable()}
                {this.renderReveal()}
            </div>
        );
    }
}

SelectableReveal.defaultProps = _.defaults({
    answers: [],
    canSelectOnStart: true
}, skoash.Component.defaultProps);

export default SelectableReveal;
