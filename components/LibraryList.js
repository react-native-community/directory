import React from 'react';
import PropTypes from 'prop-types';

import LibraryListEmptyState from '../components/LibraryListEmptyState';
import LibraryListItem from '../components/LibraryListItem';

export default class LibraryList extends React.PureComponent {
  static propTypes = {
    libraries: PropTypes.array,
    topics: PropTypes.object,
  };

  render() {
    const elements =
      this.props.libraries.length < 1
        ? <LibraryListEmptyState />
        : this.props.libraries.map(item =>
            <LibraryListItem
              key={item.github.name}
              library={item}
              topics={this.props.topics}
            />
          );

    return (
      <ul className="LibraryList">
        <style jsx>{`
          .LibraryList {
            width: 100%;
          }
        `}</style>
        {elements}
      </ul>
    );
  }
}
