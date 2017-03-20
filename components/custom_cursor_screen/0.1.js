class CustomCursorScreen extends skoash.Screen {
    constructor(props) {
        super(props);

        this.state = {
            cursorLeft: 0,
            cursorTop: 0,
            touchstart: false,
            revealOpen: false,
        };

        this.zoom = 1;

        this.moveCursor = this.moveCursor.bind(this);
        this.touchstart = this.touchstart.bind(this);
        this.resize = this.resize.bind(this);
    }

    bootstrap() {
        super.bootstrap();

        window.addEventListener('mousemove', this.moveCursor);
        window.addEventListener('touchstart', this.touchstart);

        window.addEventListener('resize', this.resize);
    }

    resize() {
        skoash.trigger('getState').then(state => {
            this.zoom = state.scale;
        });
    }

    moveCursor(e) {
        this.setState({
            cursorLeft: e.clientX / this.zoom - 50,
            cursorTop: e.clientY / this.zoom - 65,
        });
    }

    touchstart() {
        this.setState({
            touchstart: true
        });
    }

    renderCursor() {
        var cursor;
        var className;
        var ref;
        var props = [];
        cursor = this.props.cursor;
        className = ref = 'cursor';
        if (cursor && cursor.props) {
            props = cursor.props;
            className = className + ' ' + cursor.props.className;
            ref = cursor.ref || ref;
        }
        return (
            <div
                {...props}
                ref={ref}
                className={className}
                style={{
                    left: this.state.cursorLeft,
                    top: this.state.cursorTop,
                }}
            />
        );
    }

    renderContent() {
        return (
            <div>
                {this.renderCursor()}
                {this.renderContentList()}
            </div>
        );
    }
}

export default CustomCursorScreen;
