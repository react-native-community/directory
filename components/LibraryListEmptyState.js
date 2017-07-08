import React from 'react';
import Link from '../components/Link';

export default () => {
  return (
    <div className="library-list-empty-state">
      <style jsx>{`
        .library-list-empty-state {
          text-align: center;
          width: 100%;
          padding: 0 24px 0 24px;
          margin: 64px 0 64px 0;
        }

        .library-list-empty-state-img {
          display: block;
          margin: 48px auto 24px auto;
        }
      `}</style>
      <img
        className="library-list-empty-state-img"
        src="/static/notfound.png"
        width="64px"
        height="64px"
      />
      <p>
        Nothing was found! Try another search. <br />
        Want to contribute a library you like?<br />
        Share it on{' '}
        <Link isStyled href="https://slack.expo.io/">
          Expo Slack
        </Link>.
      </p>
    </div>
  );
};
