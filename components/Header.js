import React from 'react';

import Link from '../components/Link';

export default class Header extends React.PureComponent {
  render() {
    return (
      <header className="header">
        <style jsx>{`
          .header {
            width: 100%;
            max-width: 1319px;
            padding: 0 24px 0 24px;
            box-sizing: border-box;
            margin: 4rem auto 0 auto;
            display: flex;
            align-items: 'center';
            justify-content: 'space-between';

            @media (max-width: 600px) {
              margin: 2rem auto 0 auto;
            }
          }

          .header-left {
            max-width: 420px;
            width: 100%;
            padding-right: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .header-left-logo {
            flex-shrink: 0;
            padding-right: 8px;
          }

          .header-left-text {
            min-width: 25%;
            width: 100%;
          }

          .header-strong {
            font-family: 'office-code-medium', monospace;
            font-weight: 400;
          }
        `}</style>
        <div className="header-left">
          <div className="header-left-logo">
            <img src="/static/logo.png" width="64" height="64" />
          </div>
          <div className="header-left-text">
            <p>
              <strong className="header-strong">Native Directory</strong>
              {' '}
              is a curated list of
              {' '}
              <Link
                isStyled
                href="https://facebook.github.io/react-native/docs/getting-started.html">
                React Native
              </Link>
              {' '}
              libraries to help you build your projects.
            </p>
          </div>
        </div>
        <div className="header-right" />
      </header>
    );
  }
}
