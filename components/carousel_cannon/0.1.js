import classNames from 'classnames';

import Carousel from 'shared/components/carousel/0.1';
import Cannon from 'shared/components/cannon/0.1';
import Reveal from 'shared/components/reveal/0.1.js';

class CarouselCannon extends skoash.Component {
    constructor() {
        super();

        this.onReload = this.onReload.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    onReload() {
        this.refs.carousel.select();
    }

    open(message) {
        this.refs.reveal.open(message);
    }

    onSelect(target) {
        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect.call(this, target);
        }
    }

    closeRespond() {
        if (typeof this.props.closeRespond === 'function') {
            this.props.closeRespond();
        }
    }

    renderAssets() {
        if (!this.props.assets) return null;

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

    renderCarousel() {
        return (
      <Carousel
        ref="carousel"
        bin={this.props.carouselBin}
        onSelect={this.onSelect}
        completeOnStart={this.props.completeOnStart}
        checkComplete={this.props.checkComplete}
        complete={this.props.complete}
        showNum={this.props.showNum}
        targetIndex={this.props.targetIndex}
      />
    );
    }

    renderCannon() {
        return (
      <Cannon
        ref="cannon"
        ball={this.props.cannonBall}
        onReload={this.onReload}
      />
    );
    }

    renderReveal() {
        return (
      <Reveal
        ref="reveal"
        list={this.props.revealList}
        assets={this.props.revealAssets}
        closeRespond={this.closeRespond.bind(this)}
        openOnStart={this.props.openOnStart}
        autoClose={this.props.autoCloseReveal}
      />
    );
    }

    getClassNames() {
        return classNames('carousel-cannon', super.getClassNames());
    }

    render() {
        return (
      <div className={this.getClassNames()}>
        {this.renderAssets()}
        {this.renderCarousel()}
        {this.renderCannon()}
        {this.renderReveal()}
      </div>
    );
    }
}

export default CarouselCannon;
