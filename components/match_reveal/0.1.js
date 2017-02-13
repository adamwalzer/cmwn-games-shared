import SelectableReveal from 'shared/components/selectable_reveal/0.1';
import Matchable from 'shared/components/match_game/0.1';

class MatchableReveal extends SelectableReveal {
    constructor() {
        super();
    }

    selectRespond(message = null) {
        if (message && typeof this.refs.reveal.open === 'function') {
            this.open(message);
        }
    }

    onSelect() {
        this.playMedia('correct');
    }

    renderMatchable() {
        return (
            <Matchable
                ref="matchable"
                list={this.props.matchableList}
                onMatch={this.selectRespond.bind(this)}
                onSelect={this.onSelect.bind(this)}
                checkComplete={this.props.matchableCheckComplete}
                randomizeList={this.props.randomizeMatchableList}
            />
        );
    }

    render() {
        return (
            <div className={'matchable-reveal ' + this.getClasses()}>
                {this.renderAssets()}
                {this.renderMatchable()}
                {this.renderReveal()}
            </div>
        );
    }
}
export default MatchableReveal;
