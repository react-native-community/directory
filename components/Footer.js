import React from 'react';

import Link from '../components/Link';

export default () => {
  return (
    <footer className="footer">
      <style jsx>{`
        .footer {
          border-top: 1px solid #ececec;
          width: 100%;
        }

        .footer-container {
          width: 100%;
          max-width: 1319px;
          padding: 0 24px 0 24px;
          box-sizing: border-box;
          margin: 0 auto 0 auto;
          display: 'flex';
          align-items: 'flex-start';
          justify-content: 'space-between';
        }

        .footer-container-text {
          margin: 24px 0 24px 0;
        }
      `}</style>
      <div className="footer-container">
        <p className="footer-container-text">
          Missing a library?{' '}
          <Link
            isStyled
            href="https://github.com/react-community/native-directory#how-to-add-a-library">
            Add it to the directory
          </Link>. Want to learn more about React Native? Check out the{' '}
          <Link
            isStyled
            href="https://facebook.github.io/react-native/docs/getting-started.html">
            offical docs
          </Link>, and{' '}
          <Link isStyled href="https://expo.io">
            Expo
          </Link>.
        </p>
      </div>
    </footer>
  );
};
