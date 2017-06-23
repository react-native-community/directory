import React from 'react';

import Link from '../components/Link';

export default class Footer extends React.PureComponent {
  render() {
    return (
      <div className="container">
        <style jsx>{`
          .container {
            border-top: 1px solid #ECECEC;
            width: 100%;
          }

          .footer {
            width: 100%;
            max-width: 1319px;
            padding: 0 24px 0 24px;
            box-sizing: border-box;
            margin: 0 auto 0 auto;
            display: 'flex';
            align-items: 'flex-start';
            justify-content: 'space-between';
          }

          .text {
            margin: 24px 0 24px 0;
          }
        `}</style>
        <header className="footer">
          <p className="text">
            Want to learn more about React Native? Check out the
            {' '}
            <Link
              isStyled
              href="https://facebook.github.io/react-native/docs/getting-started.html">
              offical docs
            </Link>, and <Link isStyled href="https://expo.io">
              Expo
            </Link>.
          </p>
        </header>
      </div>
    );
  }
}
