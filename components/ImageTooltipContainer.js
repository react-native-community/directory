/**
 * @flow
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getViewportSize } from '../common/window';
import { TOOLTIP_WIDTH, TOOLTIP_ARROW_SIZE } from '../common/constants';

class ImageTooltipContainer extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
  };

  _container = undefined;
  _eventsBinded = false;

  _handleMouseEnter = () => {
    const { tooltip } = this.props;
    const measurements = this._calculateTooltipPosition();

    if (
      tooltip &&
      measurements.top === tooltip.top &&
      measurements.left === tooltip.left
    ) {
      return;
    }

    this.props.dispatch({
      type: 'SET_TOOLTIP',
      tooltip: {
        ...measurements,
        content: this.props.src,
      },
    });
  };

  _handleMouseLeave = () => {
    if (!this.props.tooltip) {
      return;
    }

    this._clearTooltip();
  };

  _handleClick = () => {
    this.props.dispatch({
      type: 'SET_MODAL',
      modal: {
        content: this.props.src,
      },
    });
  };

  _calculateTooltipPosition = () => {
    const rect = this._container.getBoundingClientRect();
    const pageRect = getViewportSize();

    let arrowDirection = 'SOUTH';
    let measurements = {
      top: rect.top + rect.height + TOOLTIP_ARROW_SIZE * 1.5,
      left: rect.left - TOOLTIP_WIDTH * 0.5 + rect.width * 0.5,
    };

    if (rect.top > pageRect.height * 0.55) {
      arrowDirection = 'NORTH';
      measurements = {
        top: rect.top - TOOLTIP_WIDTH - TOOLTIP_ARROW_SIZE * 1.5,
        left: rect.left - TOOLTIP_WIDTH * 0.5 + rect.width * 0.5,
      };
    }

    if (rect.left > pageRect.width * 0.66) {
      arrowDirection = 'WEST';
      measurements = {
        top: rect.top - TOOLTIP_WIDTH * 0.5 + rect.height * 0.5,
        left: rect.left - TOOLTIP_WIDTH - TOOLTIP_ARROW_SIZE * 1.5,
      };
    }

    if (rect.left < TOOLTIP_WIDTH) {
      arrowDirection = 'EAST';
      measurements = {
        top: rect.top - TOOLTIP_WIDTH * 0.5 + rect.height * 0.5,
        left: rect.left + rect.width + TOOLTIP_ARROW_SIZE * 1.5,
      };
    }

    return {
      ...measurements,
      arrowDirection,
    };
  };

  _clearTooltip = () => {
    this.props.dispatch({
      type: 'CLEAR_TOOLTIP',
      tooltip: undefined,
    });
  };

  render() {
    const onMouseEnter = this.props.isMobile
      ? undefined
      : this._handleMouseEnter;
    const onMouseLeave = this.props.isMobile
      ? undefined
      : this._handleMouseLeave;
    const onClick = this.props.isMobile ? this._handleClick : undefined;

    return (
      <span
        className="image-tooltip-container"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        ref={c => {
          this._container = c;
        }}>
        <style jsx global>{`
          .image-tooltip-container {
            display: inline-block;
            position: relative;
            padding: 8px 8px 8px 8px;
            border-radius: 3px;
            border: 1px solid #dcdcdc;
            margin: 0 12px 12px 0;
            color: #acacac;
            cursor: pointer;
            user-select: none;
            line-height: 1;
            font-family: 'office-code', monospace;
            font-size: 0.7rem;
            text-align: center;
          }

          .image-tooltip-container:hover {
            color: #555555;
            border: 1px solid #999999;
          }

          .image-tooltip-container:hover > .image-tooltip-container-svg {
            stroke: #555555;
          }

          .image-tooltip-container-svg {
            stroke: #acacac;
            display: block;
            margin: 0 0 4px 0;
          }
        `}</style>
        <svg
          className="image-tooltip-container-svg"
          xmlns="http://www.w3.org/2000/svg"
          width="16px"
          height="16px"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        {this.props.count}
      </span>
    );
  }
}

export default connect(state => {
  return { tooltip: state.tooltip };
})(ImageTooltipContainer);
