import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class TopicItem extends React.PureComponent {
  static propTypes = {
    count: PropTypes.number,
  };

  render() {
    const href = `/${this.props.sortBy}/${this.props.children}`;
    return (
      <a className="item" href={href}>
        <style jsx>{`
          .item {
            display: inline-block;
            margin: 0 8px 0 0;
            transition: all 200ms ease;
            transition-property: opacity, transform;
            cursor: pointer;
            overflow-wrap: break-word;
            word-break: break-word;
            font-family: 'office-code', monospace;
            font-size: 0.75rem;
            line-height: 1.1rem;
            color: rgba(0, 0, 0, 0.75);

            &:visited {
              color: inherit;
            }

            &:hover {
              opacity: 0.5;
            }

            &:active {
              transform: scale(1.1);
            }
          }

          .item-count {
            font-family: 'office-code-medium', monospace;
            color: rgba(65, 160, 248, 1);
          }
        `}</style>
        {this.props.children}
        [
        <span className="item-count">{this.props.count}</span>
        ]
      </a>
    );
  }
}

export default connect(state => {
  return { sortBy: state.sortBy };
})(TopicItem);
