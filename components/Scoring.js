import React from 'react';

const scoreList = [
  {
    text: '— Over 5000 stars',
    score: '35',
  },
  {
    text: 'Over 1000 stars',
    score: '25',
  },
  {
    text: 'Over 500 stars',
    score: '15',
  },
  {
    text: 'Over 100 stars',
    score: '5',
  },
  {
    text: '— Updated within 30 days',
    score: '15',
  },
  {
    text: 'Updated within 60 days',
    score: '10',
  },
  {
    text: 'Updated within 90 days',
    score: '5',
  },
  {
    text: '— Activity on issues',
    score: '10',
  },
  {
    text: '— People have forked this repo',
    score: '10',
  },
  {
    text: '— Has a wiki',
    score: '5',
  },
  {
    text: '— Has pages',
    score: '5',
  },
  {
    text: '— Has been downloaded',
    score: '5',
  },
  {
    text: '— Has at least one topic',
    score: '5',
  },
  {
    text: '— People watch this repo',
    score: '5',
  },
];

export default class Scoring extends React.PureComponent {
  render() {
    const elements = scoreList.map(each => (
      <li className="item" key={`scoring-rules-${each.text}`}>
        <style jsx>{`
          .item {
            margin: 6px 0 6px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .item-left {
            min-width: 25%;
            width: 100%;
          }

          .item-right {
            font-family: 'office-code-medium', monospace;
            flex-shrink: 0;
            width: 48px;
          }
        `}</style>
        {' '}
        <div className="item-right">+{each.score}</div>
        <div className="item-left">{each.text}</div>
      </li>
    ));

    return (
      <header className="scoring">
        <style jsx>{`
          .scoring {
            padding: 27px 0 8px 0;
          }

          .scoring-heading {
            font-family: 'office-code-medium', monospace;
            font-weight: 400;
          }

        `}</style>
        <h2 className="scoring-heading">Scoring rules</h2>
        <ul>
          {elements}
        </ul>
      </header>
    );
  }
}
