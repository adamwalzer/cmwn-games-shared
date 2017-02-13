import ItemDrawer from '../item_drawer/0.1.js';
import Canvas from '../canvas/0.1.js';

class ItemDrawerCanvas extends skoash.Component {
    constructor() {
        super();

        this.state = {
            started: false,
            background: null,
            items: [],
        };
    }

    selectRespond(message) {
        this.refs.canvas.addItem(message);
    }

    renderDrawer() {
        return (
            <ItemDrawer
                ref="drawer"
                selectRespond={this.selectRespond.bind(this)}
                data={{
                    items: [
                        {
                            type: 'background',
                            src: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSnfpzoD-' +
                                '_HTIGH37ncMqaYiqjOI4MrXSPSTCyAHbJdSsc6O9vP',
                        },
                        {
                            type: 'background',
                            src: 'http://g-ecx.images-amazon.com/images/G/01/img15/pet-products/small-tiles' +
                                '/23695_pets_vertical_store_dogs_small_tile_8._CB312176604_.jpg',
                        },
                        {
                            type: 'item',
                            canOverlap: false,
                            src: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:' +
                                'ANd9GcQPKYvInvRcKyePsdWpEQc40hcLDfLlEcRk2ho2ETWmZppiVoEGQA',
                        },
                        {
                            type: 'item',
                            canOverlap: false,
                            src: 'https://i.ytimg.com/vi/MveqXxB12YA/hqdefault.jpg',
                        },
                        {
                            type: 'item',
                            canOverlap: false,
                            src: 'https://pbs.twimg.com/profile_images/378800000674268962/' +
                                '06ce58cab26c3a0daf80cf57e5acb29b_400x400.jpeg',
                        },
                        {
                            type: 'item',
                            canOverlap: true,
                            src: 'http://emmastrend.com/wp-content/uploads/2015/10/Halloween-Hat-01.png',
                        },
                        {
                            type: 'item',
                            canOverlap: true,
                            src: 'http://clipartix.com/wp-content/uploads/2016/05/' +
                                'Top-hat-hat-clip-art-free-clip-art-microsoft-clip-art-christmas.png',
                        },
                        {
                            type: 'message',
                            src: 'http://www.clipartpanda.com/clipart_images/image-50104740/download',
                        },
                        {
                            type: 'message',
                            src: 'http://www.homemade-preschool.com/images/dog-paw-prints.png',
                        },
                    ]
                }}
            />
        );
    }

    renderCanvas() {
        return (
            <Canvas
                ref="canvas"
            />
        );
    }

    getClasses() {
        var classes = '';

        if (this.state.complete) classes += ' COMPLETE';

        return classes;
    }

    render() {
        return (
            <div className={'item-drawer-canvas' + this.getClasses()}>
                {this.renderDrawer()}
                {this.renderCanvas()}
            </div>
        );
    }
}

export default ItemDrawerCanvas;
