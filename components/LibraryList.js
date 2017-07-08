import React from 'react';
import PropTypes from 'prop-types';

import { getTimeSinceToday } from '../common/datetime';

import LibraryListEmptyState from '../components/LibraryListEmptyState';
import LibraryListItem from '../components/LibraryListItem';

export default class LibraryList extends React.PureComponent {
  static propTypes = {
    libraries: PropTypes.array,
    topics: PropTypes.object,
  };

  render() {
    let elements;
    if (this.props.libraries.length < 1) {
      elements = <LibraryListEmptyState />;
    } else {
      elements = this.props.libraries.map(item => {
        return (
          <LibraryListItem
            key={item.github.name}
            library={item}
            topics={this.props.topics}
          />
        );
      });
    }

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
