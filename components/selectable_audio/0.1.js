import Selectable from 'shared/components/selectable/0.1';

class SelectableAudio extends skoash.Component {

    selectRespond(ref) {
        this.playAudio(ref);

        if (typeof this.props.selectRespond === 'function') {
            this.props.selectRespond.call(this, ref);
        }

        if (this.props.chooseOne) {
            this.complete();
        }
    }

    checkComplete() {
        if (!this.props.chooseOne) super.checkComplete();
    }

    playAudio(ref) {
        var component;

        this.playMedia('asset-' + ref);

        component = this.refs.selectable.refs[ref];

        if (component) {
            if (component.props.correct) {
                this.playMedia('asset-correct');
            } else {
                this.playMedia('asset-incorrect');
            }
        }
    }

    renderAssets() {
        if (this.props.audioAssets) {
            return this.props.audioAssets.map((asset, key) => {
                var dataRef = asset.props['data-ref'] || key;
                var ref = 'asset-' + dataRef;
                return (
                    <skoash.Audio
                        {...asset.props}
                        ref={ref}
                        key={key}
                        data-ref={dataRef}
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
                selectClass={this.props.selectClass}
            />
        );
    }

    getClassNames() {
        return 'selectable-audio ' + super.getClassNames();
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                {this.renderAssets()}
                {this.renderSelectable()}
            </div>
        );
    }
}

export default SelectableAudio;
