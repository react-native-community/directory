import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { TOOLTIP_WIDTH, TOOLTIP_ARROW_SIZE } from '../common/constants';

class GlobalTooltip extends React.Component {
  static propTypes = {
    tooltip: PropTypes.object,
  };

  state = {
    isLoaded: false,
    isNotFound: false,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.tooltip) {
      return;
    }

    const img = new Image();

    img.onload = () => {
      this.setState({
        isLoaded: true,
        isNotFound: false,
      });
    };

    img.onerror = () => {
      this.setState({
        isLoaded: true,
        isNotFound: true,
      });
    };

    img.src = nextProps.tooltip.content;
  }

  componentDidMount() {
    window.addEventListener('scroll', this._clearTooltip);
    window.addEventListener('resize', this._clearTooltip);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._clearTooltip);
    window.removeEventListener('resize', this._clearTooltip);
  }

  _clearTooltip = () => {
    if (!this.props.tooltip) {
      return;
    }

    this.props.dispatch({
      type: 'CLEAR_TOOLTIP',
    });

    this.setState({ isLoaded: false, isNotFound: false });
  };

  _getArrowStyles = direction => {
    if (direction === 'WEST') {
      return this._getStylesWest();
    }

    if (direction === 'EAST') {
      return this._getStylesEast();
    }

    if (direction === 'NORTH') {
      return this._getStylesNorth();
    }

    if (direction === 'SOUTH') {
      return this._getStylesSouth();
    }
  };

  _getStylesSouth = () => {
    return {
      left: 0,
      right: 0,
      top: -(TOOLTIP_ARROW_SIZE - 1),
      borderLeft: `${TOOLTIP_ARROW_SIZE}px solid transparent`,
      borderRight: `${TOOLTIP_ARROW_SIZE}px solid transparent`,
      borderBottom: `${TOOLTIP_ARROW_SIZE}px solid #000000`,
    };
  };

  _getStylesEast = () => {
    return {
      top: 0,
      bottom: 0,
      left: -(TOOLTIP_ARROW_SIZE - 1),
      borderTop: `${TOOLTIP_ARROW_SIZE}px solid transparent`,
      borderBottom: `${TOOLTIP_ARROW_SIZE}px solid transparent`,
      borderRight: `${TOOLTIP_ARROW_SIZE}px solid #000000`,
    };
  };

  _getStylesNorth = () => {
    return {
      left: 0,
      right: 0,
      bottom: -(TOOLTIP_ARROW_SIZE - 1),
      borderLeft: `${TOOLTIP_ARROW_SIZE}px solid transparent`,
      borderRight: `${TOOLTIP_ARROW_SIZE}px solid transparent`,
      borderTop: `${TOOLTIP_ARROW_SIZE}px solid #000000`,
    };
  };

  _getStylesWest = (cRect, tRect) => {
    return {
      top: 0,
      bottom: 0,
      right: -(TOOLTIP_ARROW_SIZE - 1),
      borderTop: `${TOOLTIP_ARROW_SIZE}px solid transparent`,
      borderBottom: `${TOOLTIP_ARROW_SIZE}px solid transparent`,
      borderLeft: `${TOOLTIP_ARROW_SIZE}px solid #000000`,
    };
  };

  render() {
    if (!this.props.tooltip) {
      return null;
    }

    const { top, left, arrowDirection, content } = this.props.tooltip;
    const tooltipStyles = { top, left };
    const tooltipArrowStyles = this._getArrowStyles(arrowDirection);

    return (
      <figcaption
        ref={t => {
          this._tooltip = t;
        }}
        className="global-tooltip"
        style={tooltipStyles}>
        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          .fadeIn {
            animation-name: fadeIn;
          }

          .global-tooltip {
            animation: fadeIn 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
            position: fixed;
            pointer-events: none;
            background-color: #000000;
            z-index: 1;
            flex-shrink: 0;
            width: ${TOOLTIP_WIDTH}px;
            height: ${TOOLTIP_WIDTH}px;
            border-radius: 4px;
            border: 0;
            outline: 0;
            transition: 200ms cubic-bezier(0.645, 0.045, 0.355, 1) opacity;
            display: block;
            padding: 8px;
            margin: auto;
            box-sizing: border-box;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            transition: 150ms linear all;
            transition-property: opacity, visbility, transform;
            transform: translateY(0px);
            overflow-wrap: break-word;
            text-align: left;
            user-select: none;
          }

          .global-tooltip-arrow {
            width: 0;
            height: 0;
            margin: auto;
            position: absolute;
          }

          .global-tooltip-image {
            background-color: black;
            width: 100%;
            height: 304px;
            background-position: 50% 50%;
            background-size: contain;
            background-repeat: no-repeat;
            display: block;
          }

          .global-tooltip-loading {
            width: 100%;
            height: 304px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
          }
        `}</style>
        {this.state.isLoaded
          ? <div
              className="global-tooltip-image"
              style={{
                backgroundImage: `url('${this.props.tooltip.content}')`,
              }}
              width="100%"
            />
          : <div className="global-tooltip-loading">
              {this.state.isNotFound
                ? 'Image failed to load'
                : 'Loading image...'}
            </div>}
        <div className="global-tooltip-arrow" style={tooltipArrowStyles} />
      </figcaption>
    );
  }
}

export default connect(state => {
  return { tooltip: state.tooltip };
})(GlobalTooltip);
