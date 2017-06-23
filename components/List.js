import React from 'react';
import PropTypes from 'prop-types';

import TopicItem from '../components/TopicItem';
import Link from '../components/Link';

import { getTimeSinceToday } from '../common/datetime';

const renderItem = item => {
  return (
    <li
      className={`list-item ${item.isCategoryHeader ? 'list-item-mobile' : undefined}`}
      key={`list-item-${item.name}`}>
      <style jsx>{`
        .list-item {
          display: 'flex';
          padding: 27px 0 27px 0;
          border-bottom: 1px solid #ECECEC;

          &:last-child {
            border-bottom: 0;
          }

          @media (max-width: 600px) {
            display: flex;
            flex-direction: column;
          }
        }

        .list-item-mobile {
          @media (max-width: 600px) {
            display: none;
          }
        }

        .list-item-heading {
          color: #24292E;
          font-weight: 400;
          font-family: 'office-code-medium', monospace;
        }

        .list-item-heading-weightless {
          font-weight: 400;
        }

        .list-item-paragraph {
          color: #24292E;
          margin-top: 4px;
        }

        .list-item-faded {
          color: #ACACAC;
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
          padding-right: 24px;
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
        <h2
          className={`list-item-heading ${item.isCategoryHeader ? 'list-item-faded' : undefined}`}>
          {item.column1.top}
        </h2>
        <p
          className={`list-item-paragraph ${item.isCategoryHeader ? 'list-item-faded' : undefined}`}>
          {item.column1.bottom}
        </p>
      </span>
      <span className="list-item-column-wide">
        <h2
          className={`list-item-heading-weightless ${item.isCategoryHeader ? 'list-item-faded' : undefined}`}>
          {item.column2.top}
        </h2>
        <p
          className={`list-item-paragraph ${item.isCategoryHeader ? 'list-item-faded' : undefined}`}>
          {item.column2.bottom}
        </p>
      </span>
      <span className="list-item-column">
        <h2
          className={`list-item-heading-weightless ${item.isCategoryHeader ? 'list-item-faded' : undefined}`}>
          {item.column3.top}
        </h2>
        <p
          className={`list-item-paragraph ${item.isCategoryHeader ? 'list-item-faded' : undefined}`}>
          {item.column3.bottom}
        </p>
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
    const heading = renderItem({
      isCategoryHeader: true,
      column1: {
        top: '<Name>',
        bottom: '<Homepage URL>',
      },
      column2: {
        top: '<Description>',
        bottom: '<Topics[]>',
      },
      column3: {
        top: '<Last update>',
        bottom: '<Our score> — <Stars>',
      },
    });

    let elements;
    if (this.props.data.length < 1) {
      elements = (
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
            Can't find anything! Try another search. <br />
            Want to contribute a library you like?<br />
            Share it on
            {' '}
            <Link isStyled href="https://slack.expo.io/">Expo Slack</Link>.
          </p>
        </div>
      );
    } else {
      elements = this.props.data.map(item => {
        return renderItem({
          name: item.name,
          column1: {
            top: <Link isDarkStyled href={item.urls.repo}>{item.name}</Link>,
            bottom: item.urls.homepage
              ? <Link isStyled href={item.urls.homepage}>homepage</Link>
              : undefined,
          },
          column2: {
            top: item.description,
            bottom: item.topics.map(each => (
              <TopicItem
                key={`list-${item.name}-${each}`}
                count={this.props.topics[each]}>
                {each}
              </TopicItem>
            )),
          },
          column3: {
            top: getTimeSinceToday(item.stats.pushedAt),
            bottom: `${item.score}/100 — ${item.stats.stars} stars`,
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
        {heading}
        {elements}
      </ul>
    );
  }
}
