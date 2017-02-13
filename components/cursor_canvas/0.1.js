import Particle from 'shared/components/particle/0.1';

class CursorCanvas extends skoash.Component {
    constructor() {
        super();

        this.state = {
            cursorX: 0,
            cursorY: 0,
            particles: [],
            updateCanvas: null,
        };
    }

    bootstrap() {
        var context;
        var image;
        var updateCanvas;

        super.bootstrap();

        if (this.refs.canvas && this.refs.particle) {
            context = this.refs.canvas.getContext('2d');
            image = ReactDOM.findDOMNode(this.refs.particle);
            updateCanvas = window.setInterval(
                this.draw.bind(this, context, image),
                this.props.interval
            );

            this.setState({
                updateCanvas,
            });
        }

        window.addEventListener('mousemove', this.moveCursor.bind(this));
    }

    componentWillUnmount() {
        window.clearInterval(this.state.updateCanvas);

        window.removeEventListener('mousemove', this.moveCursor);
    }

    moveCursor(e) {
        var scale = skoash.trigger('getState').scale;
        this.setState({
            cursorX: e.clientX / scale,
            cursorY: e.clientY / scale,
        });
    }

    draw(context, image) {
        var p;
        var particle;
        var particles;
        var gameWidth;
        var gameHeight;
        var scale;

        if (typeof this.props.particle === 'function') {
            p = this.props.particle();
        } else {
            p = this.props.particle;
        }

        particle = new Particle({
            x: this.state.cursorX,
            y: this.state.cursorY,
            velocityY: p.velocityY,
            velocityX: p.velocityX,
            size: p.size,
            alpha: p.alpha,
        });
        particles = this.state.particles;
        particles.push(particle);

        scale = skoash.trigger('getState').scale;
        gameWidth = window.innerWidth / scale;
        gameHeight = window.innerHeight / scale;

        while (particles.length > this.props.particle.amount) particles.shift();

        context.globalAlpha = 1;
        context.clearRect(0, 0, gameWidth, gameHeight);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update(context, image, p.delta);
        }
        this.setState({ particles });
    }

    render() {
        return (
            <div className="cursor">
                <skoash.Image ref="particle" id="particle" src={this.props.src} hidden />
                <canvas ref="canvas" id="canvas" width="960" height="540" />
            </div>
        );
    }
}

CursorCanvas.defaultProps = _.defaults({
    interval: 1000 / 60,
    particle: {
        amount: 500,
        velocityY: -1,
        velocityX: 0,
        size: 1,
        alpha: 1,
        delta: {
            vy: 1,
            vx: 1,
            alpha: 0.97,
            size: 0.02,
        },
    }
}, skoash.Component.defaultProps);

export default CursorCanvas;
