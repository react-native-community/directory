import React from 'react';
import { connect } from 'react-redux';

class TopicItem extends React.PureComponent {
  _handleChooseTopic = () => {
    if (document) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    this.props.dispatch({
      type: 'TOPIC_PICKED',
      value: this.props.children,
    });
  };

  render() {
    return (
      <span className="item" onClick={this._handleChooseTopic}>
        <style jsx>{`
          .item {
            display: inline-block;
            margin-right: 8px;
            text-decoration: underline;
            transition: all 200ms ease;
            transition-property: opacity, transform;
            cursor: pointer;
            overflow-wrap: break-word;
            word-break: break-word;

            &:hover {
              opacity: 0.5;
            }

            &:active {
              transform: scale(1.2);
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
      </span>
    );
  }
}

export default connect(() => {
  return {};
})(TopicItem);
