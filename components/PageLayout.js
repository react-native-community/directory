import React from 'react';

import Topics from '../components/Topics';
import Scoring from '../components/Scoring';
import Queries from '../components/Queries';

export default class PageLayout extends React.PureComponent {
  render() {
    return (
      <div>
        <style jsx>{`
          .page-layout {
            width: 100%;
            max-width: 1319px;
            padding: 0 24px 0 24px;
            box-sizing: border-box;
            margin: 0 auto 0 auto;
            display: 'flex';
            align-items: 'flex-start';
            justify-content: 'space-between';

            @media (max-width: 768px) {
              flex-direction: column;
            }
          }

          .page-layout-left {
            min-width: 25%;
            width: 100%;
          }

          .page-layout-right {
            padding-left: 32px;
            padding-bottom: 48px;
            border-left: 1px solid #ececec;
            flex-shrink: 0;
            flex-basis: 25%;

            @media (max-width: 768px) {
              padding-left: 0;
              border-left: 0;
              border-top: 1px solid #ececec;
            }
          }
        `}</style>
        <div className="page-layout">
          <div className="page-layout-left">
            {this.props.children}
          </div>
          <div className="page-layout-right">
            <Queries />
            <Topics />
            <Scoring />
          </div>
        </div>
      </div>
    );
  }
}
