import Selectable from '../selectable/0.1.js';

import classNames from 'classnames';

class Menu extends Selectable {
    constructor() {
        super();

        this.state = {
            active: false,
            selectClass: 'SELECTED',
            classes: {},
        };
    }

    deactivate() {
        this.setState({
            active: false,
        });

        _.each(this.refs, ref => {
            _.invoke(ref, 'deactivate');
        });
    }

    onClick(e) {
        var li;
        var ul;
        var dom;
        var message;
        var active = false;
        var classes = [];

        li = e.target.closest('LI');

        if (!li) return;

        ul = li.closest('UL');
        dom = ReactDOM.findDOMNode(this); // eslint-disable-line no-undef

        if (ul !== dom) return;

        message = li.getAttribute('data-ref');

        if (this.state.classes[message] !== this.state.selectClass) {
            classes[message] = this.state.selectClass;
            active = !this.props.inactive;
        }

        this.setState({
            classes,
            active,
        });
    }

    renderItems() {
        var self = this;

        if (typeof this.props.items !== 'object') return;

        return Object.keys(this.props.items).map((key) => {
            var item;
            var onClick;
            var gotoObj;
            var categories;
            var isFinal;

            categories = this.props.categories ? [].concat(this.props.categories) : [];
            categories.push(key);

            item = this.props.items[key];

            isFinal = (
          typeof item.items !== 'object' ||
          (
            Object.prototype.toString.call(item.items) === '[object Array]' &&
            item.items[0] && !item.items[0].items
          )
        ) || (
          typeof self.props.lastLevel === 'number' &&
          self.props.lastLevel === self.props.level
        );

            if (isFinal) {
                gotoObj = {
                    index: 'item-drawer',
                    categories,
                    categoryName: item.name,
                };
                onClick = skoash.trigger.bind(null, 'goto', gotoObj);
            }

            return (
        <skoash.ListItem
          className={self.getClass(key)}
          data-ref={key}
          ref={key}
          key={key}
          onClick={onClick}
        >
          <span>{item.name || key}</span>
          {(() => {
              if (isFinal) return;
              return (
              <Menu
                ref={'menu-' + key}
                categories={categories}
                items={item.items}
                inactive={true}
                level={(self.props.level || 0) + 1}
                lastLevel={self.props.lastLevel}
              />
            );
          })()}
        </skoash.ListItem>
      );
        });
    }

    getClass(key) {
        return classNames({
            [key.replace(' ', '-')]: true,
            [this.state.classes[key] || '']: true,
        });
    }

    getClassNames() {
        return classNames({
            menu: true,
            ACTIVE: this.state.active,
        }, this.props.className);
    }

    render() {
        return (
            <ul
                className={this.getClassNames()}
                onClick={this.onClick.bind(this)}
            >
                {this.renderItems()}
            </ul>
        );
    }
}

export default Menu;
