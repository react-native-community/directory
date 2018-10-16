import React from 'react';
import PropTypes from 'prop-types';

import LibraryListEmptyState from '../components/LibraryListEmptyState';
import LibraryListItem from '../components/LibraryListItem';

import { StyleSheet, css } from 'glamor/aphrodite';

export default class LibraryList extends React.PureComponent {
  static propTypes = {
    libraries: PropTypes.array,
    isMobile: PropTypes.bool,
  };

  render() {
    const elements =
      this.props.libraries.length < 1 ? (
        <LibraryListEmptyState />
      ) : (
        this.props.libraries.map((item, index) => (
          <LibraryListItem
            key={`list-item-${index}-${item.github.name}`}
            isMobile={this.props.isMobile}
            library={item}
          />
        ))
      );

    return <div className={css(styles.list)}>{elements}</div>;
  }
}

let styles = StyleSheet.create({
  list: {
    width: '100%',
  },
});
