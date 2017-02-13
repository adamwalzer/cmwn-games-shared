import Selectable from '../selectable/0.1';

import classNames from 'classnames';

class SavedMessages extends Selectable {
    constructor() {
        super();
    }

    selectHelper(e) {
        var li;
        var message;
        var key;
        var classes = [];

        li = e.target.closest('LI');

        if (!li) return;

        key = li.getAttribute('data-ref');

        message = this.refs[key].props.item;
        classes[key] = this.state.selectClass;

        this.setState({
            message,
            classes,
        }, this.selectRespond.bind(this));
    }

    selectRespond() {
        if (typeof this.props.selectRespond === 'function' && this.state.message) {
            this.props.selectRespond(this.state.message);
        }
    }

    getClass(key) {
        return classNames({
            [this.state.classes[key] || '']: true,
            DRAFT: true,
        });
    }

    getClassNames() {
        return classNames({
            'item-drawer': true,
            SAVED: true,
            COMPLETE: this.state.complete,
        }, this.props.className);
    }

    renderThumb(item) {
        var firstImg;
        var background;

        background = item && item.rules && item.rules.background &&
      item.rules.background.src ? item.rules.background.src :
      '';

        firstImg = item && item.rules && item.rules.items &&
      item.rules.items[0] && item.rules.items[0].src ?
      item.rules.items[0].src : (
        item && item.rules && item.rules.messages &&
        item.rules.messages[0] && item.rules.messages[0].src ?
        item.rules.messages[0].src : ''
      );

        return (
            <div
                className="thumbnail"
                style={{
                    backgroundImage: `url(${background})`
                }}
            >
                <skoash.Image src={firstImg} />
            </div>
        );
    }

    renderList() {
        var items;
        var self = this;

        if (!self.props.data || !self.props.data.items) return;

        items = self.props.data.items;

        if (!items.length) {
            return (
                <li className="empty">
                    {this.props.emptyMessage}
                </li>
            );
        }

        return items.map((item, key) => {
            var timestamp = moment.utc(item.updated).local();
            return (
                <skoash.ListItem
                    className={self.getClass(key)}
                    ref={key}
                    data-ref={key}
                    item={item}
                    key={key}
                >
                    {self.renderThumb(item)}
                    <span className="timestamp">
                        <span className="date">{timestamp.format('MM.DD.YY')}</span>
                        <span className="time">{timestamp.format('h:mm a')}</span>
                    </span>
                </skoash.ListItem>
            );
        });
    }

    render() {
        return (
            <div>
                <ul className={this.getClassNames()} onClick={this.state.selectFunction.bind(this)}>
                    {this.renderList()}
                </ul>
            </div>
        );
    }
}

export default SavedMessages;
