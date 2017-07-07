/**
 * @flow
 */
import React, { Component } from 'react';
import debounce from 'lodash/debounce';

import { getViewportSize } from '../common/window';

const TOOLTIP_WIDTH = 320;
const ARROW_SIZE = 6;

export default class InlineImageTooltipContainer extends Component {
  static defaultProps = {
    text: 'This is a tooltip',
  };

  state = {
    containerRect: undefined,
    tooltipRect: undefined,
    viewport: undefined,
  };

  _container = undefined;
  _tooltip = undefined;

  componentDidMount() {
    this._updateState();
    window.addEventListener('scroll', this._handleReposition);
    window.addEventListener('resize', this._handleReposition);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleReposition);
    window.removeEventListener('resize', this._handleReposition);
  }

  _updateState = () => {
    this.setState({
      containerRect: this._container
        ? this._container.getBoundingClientRect()
        : undefined,
      tooltipRect: this._tooltip
        ? this._tooltip.getBoundingClientRect()
        : undefined,
      viewport: getViewportSize(),
    });
  };

  _handleReposition = debounce(this._updateState, 200);

  _getStylesSouth = (cRect, tRect) => {
    const tooltip = {
      left: -(tRect.width * 0.5) + cRect.width * 0.5 - 1,
      top: cRect.height + ARROW_SIZE * 1.5,
    };

    const arrow = {
      left: 0,
      right: 0,
      top: -(ARROW_SIZE - 1),
      borderLeft: `${ARROW_SIZE}px solid transparent`,
      borderRight: `${ARROW_SIZE}px solid transparent`,
      borderBottom: `${ARROW_SIZE}px solid rgba(65, 160, 248, 1)`,
    };

    return { tooltip, arrow };
  };

  _getStylesEast = (cRect, tRect) => {
    const tooltip = {
      left: cRect.width + ARROW_SIZE * 1.5,
      top: -tRect.height * 0.5 + cRect.height * 0.5,
    };

    const arrow = {
      top: 0,
      bottom: 0,
      left: -(ARROW_SIZE - 1),
      borderTop: `${ARROW_SIZE}px solid transparent`,
      borderBottom: `${ARROW_SIZE}px solid transparent`,
      borderRight: `${ARROW_SIZE}px solid rgba(65, 160, 248, 1)`,
    };

    return { tooltip, arrow };
  };

  _getStylesNorth = (cRect, tRect) => {
    const tooltip = {
      left: -(tRect.width * 0.5) + cRect.width * 0.5 - 1,
      bottom: cRect.height + ARROW_SIZE * 1.5,
    };

    const arrow = {
      left: 0,
      right: 0,
      bottom: -(ARROW_SIZE - 1),
      borderLeft: `${ARROW_SIZE}px solid transparent`,
      borderRight: `${ARROW_SIZE}px solid transparent`,
      borderTop: `${ARROW_SIZE}px solid rgba(65, 160, 248, 1)`,
    };

    return { tooltip, arrow };
  };

  _getStylesWest = (cRect, tRect) => {
    const tooltip = {
      right: cRect.width + ARROW_SIZE * 1.5,
      top: -tRect.height * 0.5 + cRect.height * 0.5,
    };

    const arrow = {
      top: 0,
      bottom: 0,
      right: -(ARROW_SIZE - 1),
      borderTop: `${ARROW_SIZE}px solid transparent`,
      borderBottom: `${ARROW_SIZE}px solid transparent`,
      borderLeft: `${ARROW_SIZE}px solid rgba(65, 160, 248, 1)`,
    };

    return { tooltip, arrow };
  };

  _determineDirectionAndGetStyles = (viewport, cRect, tRect) => {
    let direction = 'north';
    let tooltipStyles = {};
    let tooltipArrowStyles = {};

    const hasWest =
      cRect.right + (tRect.width + 1.5 * ARROW_SIZE) > viewport.width;

    const hasEast = cRect.left - (tRect.width + 1.5 * ARROW_SIZE) < 0;

    const hasSouth = cRect.top - (tRect.height + 1.5 * ARROW_SIZE) < 0;

    if (hasSouth) {
      direction = 'south';
    }

    if (hasWest) {
      direction = 'west';
    }

    if (hasEast) {
      direction = 'east';
    }

    if (direction === 'west') {
      tooltipStyles = this._getStylesWest(cRect, tRect).tooltip;
      tooltipArrowStyles = this._getStylesWest(cRect, tRect).arrow;
    }

    if (direction === 'east') {
      tooltipStyles = this._getStylesEast(cRect, tRect).tooltip;
      tooltipArrowStyles = this._getStylesEast(cRect, tRect).arrow;
    }

    if (direction === 'north') {
      tooltipStyles = this._getStylesNorth(cRect, tRect).tooltip;
      tooltipArrowStyles = this._getStylesNorth(cRect, tRect).arrow;
    }

    if (direction === 'south') {
      tooltipStyles = this._getStylesSouth(cRect, tRect).tooltip;
      tooltipArrowStyles = this._getStylesSouth(cRect, tRect).arrow;
    }

    return {
      tooltipStyles,
      tooltipArrowStyles,
    };
  };

  render() {
    const { containerRect, tooltipRect, viewport } = this.state;

    let tooltipStyles = {};
    let tooltipArrowStyles = {};
    if (containerRect && tooltipRect && viewport) {
      const newTooltipStyles = this._determineDirectionAndGetStyles(
        viewport,
        containerRect,
        tooltipRect
      );

      tooltipStyles = newTooltipStyles.tooltipStyles;
      tooltipArrowStyles = newTooltipStyles.tooltipArrowStyles;
    }

    const containerStyles = {
      width: this.props.width,
      maxWidth: this.props.maxWidth,
      display: this.props.display,
    };

    return (
      <span
        className="tooltip-container"
        style={containerStyles}
        ref={c => {
          this._container = c;
        }}>
        <style jsx global>{`
          .tooltip-container {
            display: inline-block;
            position: relative;
            padding: 4px;
            border-radius: 3px;
            border: 1px solid #dcdcdc;
            margin: 0 8px 8px 0;
            color: #acacac;
            cursor: pointer;
            user-select: none;
          }

          .tooltip-container:hover {
            color: #555555;
            border: 1px solid #999999;
          }

          .tooltip-container:hover > .tooltip-container-preview {
            stroke: #555555;
          }

          .tooltip-container:hover > .tooltip-container-element {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
          }

          .tooltip-container-element {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            background-color: rgba(65, 160, 248, 1);
            color: green;
            z-index: 1;
            flex-shrink: 0;
            width: ${TOOLTIP_WIDTH}px;
            border-radius: 4px;
            border: 0;
            outline: 0;
            line-height: 1.15rem;
            transition: 200ms cubic-bezier(0.645, 0.045, 0.355, 1) opacity;
            display: block;
            padding: 8px;
            margin: auto;
            font-size: 14px;
            font-family: sans-serif;
            position: absolute;
            box-sizing: border-box;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            transition: 150ms linear all;
            transition-property: opacity, visbility, transform;
            transform: translateY(0px);
            overflow-wrap: break-word;
            text-align: left;
            user-select: none;
          }

          .tooltip-container-arrow {
            width: 0;
            height: 0;
            margin: auto;
            position: absolute;
          }

          .tooltip-container-preview {
            stroke: #acacac;
            display: block;
          }

          .tooltip-container-image {
            display: block;
          }

          .tooltip-container-count {
            font-family: 'office-code', monospace;
            font-size: 0.7rem;
            text-align: center;
            margin-bottom: -4px;
          }
        `}</style>
        <svg
          className="tooltip-container-preview"
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
        <div className="tooltip-container-count">
          {this.props.count}
        </div>
        <figcaption
          ref={t => {
            this._tooltip = t;
          }}
          className="tooltip-container-element"
          style={tooltipStyles}>
          <img
            className="tooltip-container-image"
            src={this.props.src}
            width="100%"
          />
          <div className="tooltip-container-arrow" style={tooltipArrowStyles} />
        </figcaption>
      </span>
    );
  }
}
