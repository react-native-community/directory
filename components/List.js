import React from 'react';
import PropTypes from 'prop-types';

import TopicItem from '../components/TopicItem';
import Link from '../components/Link';
import PercentageBar from '../components/PercentageBar';
import ScorePercentageBar from '../components/ScorePercentageBar';

import * as SVG from '../common/svg';

import { getTimeSinceToday } from '../common/datetime';

const getPercentageRemaining = item => {
  let amount = 0;
  if (item.ios) {
    amount += 1;
  }

  if (item.android) {
    amount += 1;
  }

  if (item.web) {
    amount += 1;
  }

  if (item.expo) {
    amount += 1;
  }

  return 100 - amount / 4 * 100;
};

const renderEmptyState = () => {
  return (
    <div className="item-emptystate">
      <style jsx>{`
        .item-emptystate {
          text-align: center;
          width: 100%;
          padding: 0 24px 0 24px;
          margin-top: 64px;
          margin-bottom: 64px;
        }

        .item-emptystate-img {
          display: block;
          margin: 48px auto 24px auto;
        }
      `}</style>
      <img
        className="item-emptystate-img"
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

const renderItem = item => {
  return (
    <li className="list-item" key={`list-item-${item.name}`}>
      <style jsx>{`
        .list-item {
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

        .list-item-heading {
          color: #24292e;
          font-weight: 700;
        }

        .list-item-heading-weightless {
          font-weight: 400;
        }

        .list-item-paragraph {
          color: #24292e;
        }

        .list-item-column {
          flex-basis: 30%;
          padding-right: 24px;
          overflow-wrap: break-word;
          word-break: break-word;

          @media (max-width: 600px) {
            flex-basis: 100%;
            padding-right: 0px;
            margin-bottom: 16px;
          }
        }

        .list-item-column-wide {
          flex-basis: 40%;
          padding-right: 40px;
          overflow-wrap: break-word;
          word-break: break-word;

          @media (max-width: 600px) {
            flex-basis: 100%;
            padding-right: 0px;
            margin-bottom: 16px;
          }
        }
      `}</style>
      <span className="list-item-column">
        <h2 className={`list-item-heading`}>
          {item.column1.top}
        </h2>
        <div className={`list-item-paragraph`}>
          {item.column1.bottom}
        </div>
      </span>
      <span className="list-item-column-wide">
        <h2 className={`list-item-heading-weightless`}>
          {item.column2.top}
        </h2>
        <div className={`list-item-paragraph`}>
          {item.column2.bottom}
        </div>
      </span>
      <span className="list-item-column">
        <div className={`list-item-paragraph`}>
          {item.column3.content}
        </div>
      </span>
    </li>
  );
};

export default class List extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array,
    topics: PropTypes.object,
  };

  render() {
    let elements;
    if (this.props.data.length < 1) {
      elements = renderEmptyState();
    } else {
      elements = this.props.data.map(item => {
        return renderItem({
          name: item.github.name,
          column1: {
            top: (
              <Link isDarkStyled href={item.github.urls.repo}>
                {item.github.name}
              </Link>
            ),
            bottom: (
              <div>
                <div className="item-compat-list">
                  <style jsx>{`
                    .item-compat {
                      margin-top: 24px;
                    }

                    .item-compat-label {
                      font-family: 'office-code-medium', monospace;

                      font-size: 0.65rem;
                      text-transform: uppercase;
                      margin-top: 16px;
                      margin-bottom: 8px;
                    }

                    .item-compat-award {
                      font-family: 'office-code', monospace;
                      font-size: 0.8rem;
                      display: flex;
                      align-items: center;
                    }

                    .item-compat-award-text {
                      margin-left: 8px;
                    }
                  `}</style>
                  {item.goldstar
                    ? <div className="item-compat-award">
                        {SVG.award}
                        <span className="item-compat-award-text">
                          Recommended library
                        </span>
                      </div>
                    : undefined}
                  <div className="item-compat">
                    <div className="item-compat-label">Compatability</div>
                    <PercentageBar remaining={getPercentageRemaining(item)} />
                    <div className="item-compat-label">Health</div>
                    <ScorePercentageBar remaining={100 - item.score} />
                  </div>
                </div>
              </div>
            ),
          },
          column2: {
            top: item.github.description,
            bottom: (
              <div>
                <div className="item-supported">
                  <style jsx>{`
                    .item-supported {
                      margin-top: 24px;
                    }
                  `}</style>
                  Compatible with:{' '}
                  {[
                    item.web ? 'Web' : null,
                    item.ios ? 'iOS' : null,
                    item.android ? 'Android' : null,
                    item.expo ? 'Expo' : null,
                    'React Native',
                  ].map((each, idx, arr) => {
                    if (!each) {
                      return null;
                    }

                    return `${each}${idx !== arr.length - 1 ? ', ' : ''}`;
                  })}
                </div>
                <div className="item-topics">
                  <style jsx>{`
                    .item-topics {
                      margin-top: 24px;
                      margin-bottom: 24px;
                    }
                  `}</style>
                  {item.github.topics.map(each =>
                    <TopicItem
                      key={`list-${item.name}-${each}`}
                      count={this.props.topics[each]}>
                      {each}
                    </TopicItem>
                  )}
                </div>
              </div>
            ),
          },
          column3: {
            content: (
              <div>
                <style jsx>{`
                  .item-meta-info {
                    margin-top: 2px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    font-family: 'office-code', monospace;
                    font-size: 0.75rem;
                  }

                  .item-meta-info-svg {
                    margin-right: 8px;
                  }
                `}</style>
                <div className="item-meta-info">
                  <span className="item-meta-info-svg">
                    {SVG.calendar}
                  </span>
                  {`Updated ${getTimeSinceToday(item.github.stats.pushedAt)}`}
                </div>
                <div className="item-meta-info">
                  <span className="item-meta-info-svg">{SVG.star}</span>
                  {`${item.github.stats.stars}`} stars
                </div>
                <div className="item-meta-info">
                  <span className="item-meta-info-svg">
                    {SVG.download}
                  </span>
                  <Link
                    isStyled
                    href={`https://www.npmjs.com/package/${item.npmPkg}`}>
                    {`${item.npm.downloads}`} downloads
                  </Link>
                </div>
                {item.github.stats.issues > 0
                  ? <div className="item-meta-info">
                      <span className="item-meta-info-svg">
                        {SVG.file}
                      </span>
                      <Link isStyled href={`${item.github.urls.repo}/issues`}>
                        {`${item.github.stats.issues}`} issues
                      </Link>
                    </div>
                  : undefined}
                {item.github.urls.homepage
                  ? <div className="item-meta-info">
                      <span className="item-meta-info-svg">
                        {SVG.website}
                      </span>
                      <Link isStyled href={item.github.urls.homepage}>
                        Visit Website
                      </Link>
                    </div>
                  : undefined}{' '}
              </div>
            ),
          },
        });
      });
    }

    return (
      <ul className="List">
        <style jsx>{`
          .list {
            width: 100%;
            height: 72px;
          }
        `}</style>
        {elements}
      </ul>
    );
  }
}
