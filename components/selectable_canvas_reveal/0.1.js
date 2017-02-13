import SelectableReveal from 'shared/components/selectable_reveal/0.1.js';
import SelectableCanvas from 'shared/components/selectable_canvas/0.1.js';

class SelectableCanvasReveal extends SelectableReveal {
    renderSelectable() {
        return (
            <SelectableCanvas
                ref="selectable-canvas"
                list={this.props.selectableList}
                selectRespond={this.selectRespond.bind(this)}
                selectClass={this.props.selectableSelectClass}
            />
        );
    }
}

export default SelectableCanvasReveal;
