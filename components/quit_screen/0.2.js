import classNames from 'classnames';

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
                        <button
                            className={classNames('quit-button', 'quit-yes',
                                this.props.quitYesClassName
                            )}
                            onClick={this.okay.bind(this)}
                        />
                        <button
                            className={classNames('quit-button', 'quit-no',
                                this.props.quitNoClassName
                            )}
                            onClick={this.cancel.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default function (props) {
    return (<QuitScreen
        {...props}
        id="quit"
    />);
};
