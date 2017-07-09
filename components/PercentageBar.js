import React from 'react';
import PropTypes from 'prop-types';

export default class PercentageBar extends React.PureComponent {
  static propTypes = {
    percentageRemaining: PropTypes.number,
    gradientType: PropTypes.string,
  };

  static defaultProps = {
    percentageRemaining: 100,
    gradientType: null,
  };

  render() {
    const progressBarClasses = `percentage-bar-progress
      ${!this.props.gradientType
        ? 'percentage-bar-progress--gradient'
        : undefined}
      ${this.props.gradientType === 'blue'
        ? 'percentage-bar-progress--gradient-blue'
        : undefined}`;

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

          .percentage-bar-progress {
            width: 100%;
            height: 4px;
          }

          .percentage-bar-progress--gradient {
            background: #00c9ff;
            background: -webkit-linear-gradient(to right, #00c9ff, #92fe9d);
            background: linear-gradient(to right, #00c9ff, #92fe9d);
          }

          .percentage-bar-progress--gradient-blue {
            background: #396afc;
            background: -webkit-linear-gradient(to left, #396afc, #2948ff);
            background: linear-gradient(to left, #396afc, #2948ff);
          }

          .percentage-bar-progress-remaining {
            position: absolute;
            right: 0;
            background: #ffffff;
            height: 4px;
          }

          .percentage-bar-axis {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.6rem;
            width: 100%;
            height: 24px;
            position: relative;
          }

          .percentage-bar-axis-first {
            position: absolute;
            left: -2px;
          }

          .percentage-bar-axis-middle {
            position: absolute;
            left: 0;
            right: 0;
            width: 24px;
            text-align: center;
            margin: auto;
          }

          .percentage-bar-axis-last {
            position: absolute;
            right: -8px;
          }
        `}</style>

        <div className="percentage-bar">
          <div className={progressBarClasses}>
            <figure
              className="percentage-bar-progress-remaining"
              style={{ width: `${this.props.percentageRemaining}%` }}
            />
          </div>
          <span className="percentage-bar-start" />
          <span className="percentage-bar-end" />
          <span className="percentage-bar-middle" />
        </div>
        <div className="percentage-bar-axis">
          <span className="percentage-bar-axis-first">0</span>
          <span className="percentage-bar-axis-middle">50</span>
          <span className="percentage-bar-axis-last">100</span>
        </div>
      </div>
    );
  }
}
