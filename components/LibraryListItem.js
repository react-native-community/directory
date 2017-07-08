import React from 'react';
import PropTypes from 'prop-types';

import LibraryListItemColumnOne from '../components/LibraryListItemColumnOne';
import LibraryListItemColumnTwo from '../components/LibraryListItemColumnTwo';
import LibraryListItemColumnThree from '../components/LibraryListItemColumnThree';

export default class LibraryListItem extends React.PureComponent {
  static propTypes = {
    library: PropTypes.object,
    topics: PropTypes.object,
    isMobile: PropTypes.bool,
  };

  _renderColumnThree = () => {};

  render() {
    return (
      <li className="library-list-item">
        <style jsx>{`
          .library-list-item {
            display: 'flex';
            padding: 27px 0 27px 0;
            border-bottom: 1px solid #ececec;

            &:last-child {
              border-bottom: 0;
            }

            @media (max-width: 640px) {
              flex-direction: column;
            }
          }

          .library-list-item-column {
            flex-basis: 30%;
            padding: 0 24px 0 0;
            overflow-wrap: break-word;
            word-break: break-word;

            @media (max-width: 600px) {
              flex-basis: 100%;
              padding: 0 0 0 0;
              margin: 0 0 16px 0;
            }
          }

          .library-list-item-column--wide {
            flex-basis: 40%;

            @media (max-width: 600px) {
              flex-basis: 100%;
            }
          }

          .library-list-item-column--body {
            font-size: 0.9rem;
            line-height: 1.3rem;
            color: #24292e;
          }
        `}</style>
        <section className="library-list-item-column">
          <LibraryListItemColumnOne library={this.props.library} />
        </section>
        <section className="library-list-item-column library-list-item-column--wide library-list-item-column--body">
          <LibraryListItemColumnTwo
            isMobile={this.props.isMobile}
            library={this.props.library}
            topics={this.props.topics}
          />
        </section>
        <section className="library-list-item-column">
          <LibraryListItemColumnThree library={this.props.library} />
        </section>
      </li>
    );
  }
}
