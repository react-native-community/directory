import React from 'react';
import PropTypes from 'prop-types';
import LibraryListEmptyState from '../components/LibraryListEmptyState';
import LibraryListItem from '../components/LibraryListItem';

export default class LibraryList extends React.PureComponent {
  static propTypes = {
    libraries: PropTypes.array,
    isMobile: PropTypes.bool,
  };

  render() {
    const elements = this.props.libraries.length < 1
      ? <LibraryListEmptyState />
      : this.props.libraries.map((item, index) => (
          <LibraryListItem
            key={`list-item-${index}-${item.github.name}`}
            isMobile={this.props.isMobile}
            library={item}
          />
        ));

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
