import React from 'react';

export default class ScorePercentageBar extends React.PureComponent {
  static defaultProps = {
    remaining: 100,
  };

  render() {
    return (
      <div>
        <style jsx>{`
          .percentage-bar {
            width: 100%;
            border-bottom: 1px solid #000000;
            position: relative;
          }

          .percentage-bar-start {
            background: #000000;
            height: 11px;
            width: 1px;
            position: absolute;
            left: 0;
            top: -3px;
          }

          .percentage-bar-end {
            background: #000000;
            height: 11px;
            width: 1px;
            position: absolute;
            right: 0;
            top: -3px;
          }

          .percentage-bar-middle {
            background: #000000;
            height: 11px;
            width: 1px;
            position: absolute;
            right: 0;
            left: 0;
            margin: auto;
            top: -3px;
          }

          .progress {
            width: 100%;
            height: 4px;
            background: #396afc;
            background: -webkit-linear-gradient(to left, #396afc, #2948ff);
            background: linear-gradient(to left, #396afc, #2948ff);
          }

          .progress-remaining {
            position: absolute;
            right: 0;
            background: #ffffff;
            height: 4px;
          }

          .numbers {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.6rem;
            width: 100%;
            height: 20px;
            position: relative;
          }

          .numbers-first {
            position: absolute;
            left: -2px;
          }

          .numbers-middle {
            position: absolute;
            left: 0;
            right: 0;
            width: 24px;
            text-align: center;
            margin: auto;
          }

          .numbers-last {
            position: absolute;
            right: -8px;
          }
        `}</style>
        <div>
          <div className="percentage-bar">
            <div className="progress">
              <div
                className="progress-remaining"
                style={{ width: `${this.props.remaining}%` }}
              />
            </div>
            <div className="percentage-bar-start" />
            <div className="percentage-bar-end" />
            <div className="percentage-bar-middle" />
          </div>
          <div className="numbers">
            <span className="numbers-first">0</span>
            <span className="numbers-middle">50</span>
            <span className="numbers-last">100</span>
          </div>
        </div>
      </div>
    );
  }
}
