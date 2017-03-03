import Selectable from 'shared/components/selectable/0.1';

class SelectableScreen extends skoash.Screen {
    selectRespond(message) {
        this.playMedia(message);

        if (this.props.answers && ~this.props.answers.indexOf(message)) {
            this.playMedia('correct');
        } else if (this.props.answers) {
            this.playMedia('incorrect');
        }

        if (typeof this.props.selectRespond === 'function') {
            this.props.selectRespond.call(this, message);
        }
    }

    renderContent() {
        return (
            <div>
                {this.renderContentList()}
                <Selectable
                    ref="selectable"
                    selectRespond={this.selectRespond.bind(this)}
                    list={this.props.selectableList}
                />
            </div>
        );
    }
}

export default SelectableScreen;
