import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, css } from 'glamor/aphrodite';

import LibraryListItemColumnOne from '../components/LibraryListItemColumnOne';
import LibraryListItemColumnTwo from '../components/LibraryListItemColumnTwo';
import LibraryListItemColumnThree from '../components/LibraryListItemColumnThree';

export default class LibraryListItem extends React.PureComponent {
  static propTypes = {
    library: PropTypes.object,
    isMobile: PropTypes.bool,
  };

  render() {
    return (
      <div className={css(styles.item)}>
        <LibraryListItemColumnOne library={this.props.library} />
        <LibraryListItemColumnTwo isMobile={this.props.isMobile} library={this.props.library} />
        <LibraryListItemColumnThree library={this.props.library} />
      </div>
    );
  }
}

let styles = StyleSheet.create({
  item: {
    display: 'flex',
    width: '100%',
    padding: '27px 0 27px 0',
    borderBottom: '1px solid #ECECEC',
    ':last-child': {
      borderBottom: 0,
    },
    '@media (max-width: 640px)': {
      flexDirection: 'column',
    },
  },
});
