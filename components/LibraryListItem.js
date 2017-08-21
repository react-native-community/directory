import React from 'react';
import PropTypes from 'prop-types';

import LibraryListItemColumnOne from '../components/LibraryListItemColumnOne';
import LibraryListItemColumnTwo from '../components/LibraryListItemColumnTwo';
import LibraryListItemColumnThree
  from '../components/LibraryListItemColumnThree';

export default class LibraryListItem extends React.PureComponent {
  static propTypes = {
    library: PropTypes.object,
    isMobile: PropTypes.bool,
  };

  render() {
    return (
      <div className="library-list-item">
        <style jsx>{`
          .library-list-item {
            display: flex;
            width: 100%;
            padding: 27px 0 27px 0;
            border-bottom: 1px solid #ececec;

            &:last-child {
              border-bottom: 0;
            }

            @media (max-width: 640px) {
              flex-direction: column;
            }
          }
        `}</style>
        <LibraryListItemColumnOne library={this.props.library} />
        <LibraryListItemColumnTwo
          isMobile={this.props.isMobile}
          library={this.props.library}
        />
        <LibraryListItemColumnThree library={this.props.library} />
      </div>
    );
  }
}
