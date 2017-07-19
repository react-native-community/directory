import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

import LibraryListEmptyState from '../components/LibraryListEmptyState';
import LibraryListItem from '../components/LibraryListItem';

export default class LibraryList extends React.PureComponent {
  static propTypes = {
    libraries: PropTypes.array,
    topics: PropTypes.object,
    isMobile: PropTypes.bool,
    onEndReached: PropTypes.func.isRequired,
    onEndReachedThreshold: PropTypes.number,
  };

  static defaultProps = {
    onEndReachedThreshold: 1000,
  };

  componentDidMount() {
    document.addEventListener('scroll', this._handleScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this._handleScroll);
  }

  _handleScroll = throttle(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;

    if ((scrollHeight - scrollTop) < this.props.onEndReachedThreshold) {
      this.props.onEndReached();
    }
  }, 100);

  render() {
    const elements =
      this.props.libraries.length < 1
        ? <LibraryListEmptyState />
        : this.props.libraries.map((item, index) =>
            <LibraryListItem
              key={`list-item-${index}-${item.github.name}`}
              isMobile={this.props.isMobile}
              library={item}
              topics={this.props.topics}
            />
          );

    return (
      <div className="LibraryList">
        <style jsx>{`
          .LibraryList {
            width: 100%;
          }
        `}</style>
        {elements}
      </div>
    );
  }
}
