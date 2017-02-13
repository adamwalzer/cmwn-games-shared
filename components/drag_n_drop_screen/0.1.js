import DropzoneReveal from 'shared/components/dropzone_reveal/0.2';

class DragNDropScreen extends skoash.Screen {
    constructor() {
        super();
        this.correctRespond = this.correctRespond.bind(this);
        this.dragRespond = this.dragRespond.bind(this);
    }

    dragRespond(draggable) {
        _.forIn(this.refs['dropzone-reveal'].refs.dropzone.refs, (ref, key) => {
            if (key.indexOf('dropzone-') === -1) return;
            if (!this.props.multipleAnswers) {
                if (ref && ref.state && ref.state.content === draggable) {
                    ref.setState({
                        content: null
                    });
                }
            }
        });
        this.incomplete();
    }

    correctRespond(draggable, dropzoneKey) {
        var dropzone;
        var complete = true;
        var content;
        var totalComplete = 0;
        dropzone = this.refs['dropzone-reveal'].refs.dropzone.refs[`dropzone-${dropzoneKey}`];

        if (this.props.centerOnCorrect) {
            if (typeof this.props.centerOnCorrect === 'function') {
                this.props.centerOnCorrect(draggable, dropzone);
            } else {
                this.centerOnCorrect(draggable, dropzone);
            }
        }

        if (this.props.manualReveal && typeof this.props.manualReveal === 'function') {
            this.props.manualReveal.call(this, draggable);
        }

        if (this.props.multipleAnswers) {
            content = dropzone.state.content || [];
            if (content.indexOf(draggable) === -1) content.push(draggable);
            dropzone.setState({content});
        } else {
            if (dropzone.state.content && draggable !== dropzone.state.content) {
                dropzone.state.content.returnToStart();
                dropzone.state.content.markIncorrect();
            }
            dropzone.setState({
                content: draggable
            });
        }

        _.forIn(this.refs['dropzone-reveal'].refs.dropzone.refs, (ref, key) => {
            if (key.indexOf('dropzone-') === -1) return;
            if (!ref.state.content) {
                complete = false;
                return;
            }
            if (this.props.multipleAnswers) {
                totalComplete += ref.state.content.length;
                if (totalComplete !== this.refs['dropzone-reveal'].refs.dropzone.draggables.length) {
                    complete = false;
                }
            }
        });

        if (complete) this.complete();
    }

    centerOnCorrect(draggable, dropzone) {
        var endX = (draggable.state.endX - draggable.state.corners[0].x + dropzone.corners[0].x) +
            ((draggable.state.corners[1].x - draggable.state.corners[0].x) / 2);
        var endY = (draggable.state.endY - draggable.state.corners[0].y + dropzone.corners[0].y) +
            ((draggable.state.corners[3].y - draggable.state.corners[0].y) / 2);
        draggable.setEnd(endX, endY);
    }


    renderContent() {
        return (
            <div>
                {this.renderContentList()}
                <DropzoneReveal
                    ref="dropzone-reveal"
                    assets={this.props.assets}
                    dropzoneAssets={this.props.dropzoneAssets}
                    dragRespond={this.dragRespond}
                    correctRespond={this.correctRespond}
                    dropzones={this.props.dropzones}
                    dropzoneList={this.props.dropzoneList}
                    revealList={this.props.revealList}
                    revealAssets={this.props.revealAssets}
                    checkComplete={this.props.checkComplete}
                    manualReveal={this.props.manualReveal}
                    answers={this.props.answers}
                />
                {this.renderContentList('afterDropzoneList')}
            </div>
        );
    }
}

DragNDropScreen.defaultProps = _.defaults({
    checkComplete: false,
    checkReady: true,
}, skoash.Screen.defaultProps);

export default DragNDropScreen;
