import classNames from 'classnames';

import Selectable from '../selectable/0.1';

class Inbox extends Selectable {
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

        if (!this.refs[key]) return;

        message = this.refs[key].props.item;
        classes[key] = this.props.selectClass;

        this.setState({
            message,
            classes,
        });

        if (message.status !== 'COMPLETE') return;

        if (typeof this.props.selectRespond === 'function' && message) {
            this.props.selectRespond(message);
        }
    }

    getClass(key, read) {
        return classNames(
      this.state.classes[key], {
          UNREAD: this.props.friendKey === 'created_by' && !read,
          SENT: this.props.friendKey !== 'created_by'
      }
    );
    }

    getClassNames() {
        return classNames({
            'item-drawer': true,
            COMPLETE: this.state.complete,
        }, this.props.className);
    }

    getStatusText(item) {
        if (!item.status || item.status === 'COMPLETE') return '';
        return item.status;
    }

    renderList() {
        var items;
        var friends;

        if (!this.props.data || !this.props.data.items) return;

        items = this.props.data.items;

        if (!items.length) {
            return (
                <li className="empty">
                    {this.props.emptyMessage}
                </li>
            );
        }

        friends = _.get(this.props.gameState, 'data.user', []);

        return _.map(items, (item, key) => {
            var timestamp;
            var image;
            var name;
            timestamp = moment.utc(item.updated).local();
            key = 'message-' + key;

            if (item[this.props.friendKey] == null) return null;

            _.each(friends, friend => {
                if (item[this.props.friendKey] === friend.friend_id) {
                    image = friend._embedded.image ? friend._embedded.image.url : '';
                    name = friend.username;
                }
            });

            if (!name) {
                skoash.trigger('getData', {
                    name: 'getFriend',
                    'friend_id': item[this.props.friendKey],
                });
                name = '';
            }

            if (this.props.friendKey === 'friend_to') {
                item.sent = true;
            }

            return (
                <skoash.ListItem
                    className={this.getClass(key, item.read)}
                    ref={key}
                    data-ref={key}
                    item={item}
                    key={key}
                >
                    <skoash.Image src={image} />
                    <span className={'username' + (name.length > 15 ? ' long' : '')}>
                        {name}
                    </span>
                    <span className="timestamp">
                        <span className="date">{timestamp.format('MM.DD.YY')}</span>
                        <span className="time">{timestamp.format('h:mm a')}</span>
                    </span>
                    <span className={'status ' + item.status}>
                        {this.getStatusText(item)}
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

Inbox.defaultProps = _.defaults({
    friendKey: 'created_by',
    gameState: {},
}, Selectable.defaultProps);

export default Inbox;
