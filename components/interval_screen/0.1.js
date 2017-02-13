import _ from 'lodash';

class IntervalScreen extends skoash.Screen {
    open(opts) {
        var self = this;
        var audioSequence;

        super.open(opts);

        this.setState(this.props.states);

        if (this.state.replay) {
            this.checkComplete = null;
            this.incomplete();
            audioSequence = this.requireForComplete.find(ref => {
                var refAudio = self.refs[ref].audio;
                return refAudio.sfx.length > 0 || refAudio.voiceOver.length > 0;
            });
            if (audioSequence) this.refs[audioSequence].incompleteRefs();
            this.checkComplete = super.checkComplete;
        }
    }

    startNextAnimation() {
        var states = Object.keys(this.props.states);
        var nextAnimation = states.find(key => {
            return !this.state[key];
        });
        var temp = {};
        temp[nextAnimation] = true;
        this.setState(temp);
    }

    getClassNames() {
        var classNames = super.getClassNames();
        _.each(this.props.states, (value, key) => {
            value = this.state[key];
            if (value) classNames += ' ' + key.toUpperCase();
        });
        return classNames;
    }

    renderContentList(listName = 'children') {
        var self = this;
        var children = [].concat(this.props[listName]);
        return children.map((component, key) => {
            var ref = component.ref || component.props['data-ref'] || listName + '-' + key;
            if (!component) return;
            if (component.type.name === 'AudioSequence') { // does not work for media sequence yet
                return (
                    <component.type
                        {...component.props}
                        ref={ref}
                        key={key}
                        playInterval={self.props.interval}
                        onPlay={self.startNextAnimation.bind(this)}
                    />
                );
            }
            return (
                <component.type
                    {...component.props}
                    ref={ref}
                    key={key}
                />
            );
        });
    }
}

export default IntervalScreen;
