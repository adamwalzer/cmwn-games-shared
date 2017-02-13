class QuitScreen extends skoash.Screen {
    okay() {
        skoash.trigger('quit');
    }

    cancel() {
        this.close();
        skoash.trigger('menuClose', {
            id: this.props.id,
        });
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

    render() {
        return (
            <div id={this.props.id} className={'screen ' + this.getClassNames()}>
                {this.renderAssets()}
                <div className="center">
                    <div className="frame">
                        <h2>Are you sure you<br/>want to quit?</h2>
                        <h3>Your game progress will be saved</h3>
                        <button className="quit-yes" onClick={this.okay.bind(this)}></button>
                        <button className="quit-no" onClick={this.cancel.bind(this)}></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default (
    <QuitScreen
        id="quit"
    />
);
