// As of skoash 1.1.0 this component can be found at skoash.MediaCollection
/* eslint-disable no-console */
console.warn('As of skoash 1.1.0 this component can be found at skoash.MediaCollection');
/* eslint-enable no-console */

class MediaCollection extends skoash.Component {
    play(ref) {
        if (this.refs[ref]) {
            this.refs[ref].play();
            this.props.onPlay.call(this, ref);
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);

        if (props.play && props.play !== this.props.play) {
            this.play(props.play);
        }
    }
}

MediaCollection.defaultProps = _.defaults({
    onPlay: _.noop,
}, skoash.Component.defaultProps);

export default MediaCollection;
