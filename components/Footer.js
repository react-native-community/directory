import React from 'react';

import Link from '../components/Link';

export default class Footer extends React.PureComponent {
  render() {
    return (
      <div className="footer-container">
        <style jsx>{`
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

          .footer-container {
            border-top: 1px solid #ececec;
            width: 100%;
          }

          .footer-text {
            margin: 24px 0 24px 0;
          }
        `}</style>
        <footer className="footer">
          <p className="footer-text">
            Want to learn more about React Native? Check out the{' '}
            <Link
              isStyled
              href="https://facebook.github.io/react-native/docs/getting-started.html">
              offical docs
            </Link>, and{' '}
            <Link isStyled href="https://expo.io">
              Expo
            </Link>.
          </p>
        </footer>
      </div>
    );
  }
}
