import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'glamor/aphrodite';

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
    const progressBarClasses = css(
      styles.barProgress,
      !this.props.gradientType ? styles.barProgressGradientDefault : undefined,
      this.props.gradientType === 'blue'
        ? styles.barProgressGradientBlue
        : undefined
    );

    return (
      <div>
        <div className={css(styles.bar)}>
          <div className={progressBarClasses}>
            <figure
              className={css(styles.barProgressRemaining)}
              style={{ width: `${this.props.percentageRemaining}%` }}
            />
          </div>
          <span className={css(styles.barStart)} />
          <span className={css(styles.barEnd)} />
          <span className={css(styles.barMiddle)} />
        </div>
        <div className={css(styles.axis)}>
          <span className={css(styles.axisFirst)}>0</span>
          <span className={css(styles.axisMiddle)}>GOOD</span>
          <span className={css(styles.axisLast)}>100</span>
        </div>
      </div>
    );
  }
}

let styles = StyleSheet.create({
  bar: {
    width: '100%',
    borderBottom: '1px solid #000000',
    position: 'relative',
  },
  barStart: {
    background: '#000000',
    height: '11px',
    width: '1px',
    position: 'absolute',
    left: 0,
    top: '-3px',
  },
  barEnd: {
    background: '#000000',
    height: '11px',
    width: '1px',
    position: 'absolute',
    right: 0,
    top: '-3px',
  },
  barMiddle: {
    background: '#000000',
    height: '11px',
    width: '1px',
    position: 'absolute',
    right: 0,
    left: 0,
    margin: 'auto',
    top: '-3px',
  },
  barProgress: {
    width: '100%',
    height: '4px',
  },
  barProgressGradientDefault: {
    background: '#00c9ff',
    background: '-webkit-linear-gradient(to right, #00c9ff, #92fe9d)',
    background: 'linear-gradient(to right, #00c9ff, #92fe9d)',
  },
  barProgressGradientBlue: {
    background: '#396afc',
    background: '-webkit-linear-gradient(to left, #396afc, #2948ff)',
    background: 'linear-gradient(to left, #396afc, #2948ff)',
  },
  barProgressRemaining: {
    position: 'absolute',
    right: 0,
    background: '#ffffff',
    height: '4px',
  },
  axis: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.6rem',
    width: '100%',
    height: '24px',
    position: 'relative',
  },
  axisFirst: {
    position: 'absolute',
    left: '-2px',
  },
  axisMiddle: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '48px',
    textAlign: 'center',
    margin: 'auto',
  },
  axisLast: {
    position: 'absolute',
    right: '-8px',
  },
});
