import React from 'react';
import { connect } from 'react-redux';

import TopicItem from '../components/TopicItem';

class Topics extends React.PureComponent {
  render() {
    const topicElements = [];
    Object.keys(this.props.topics).forEach(key => {
      topicElements.push(
        <li key={`topic-list-${key}`} className="topics-item">
          <style jsx>{`
            .topics-item {
              display: block;
              margin: 6px 0 8px 0;
            }
          `}</style>
          <TopicItem count={this.props.topics[key]}>
            {key}
          </TopicItem>
        </li>
      );
    });

    return (
      <header className="topics">
        <style jsx>{`
          .topics {
            padding: 27px 0 8px 0;
          }

          .topics-heading {
            font-family: 'office-code-medium', monospace;
            font-weight: 400;
          }

          .topics-item {
            display: block;
            margin: 4px 0 4px 0;
          }
        `}</style>
        <h2 className="topics-heading">Topics</h2>
        <ul className="topics-list">
          {topicElements}
        </ul>
      </header>
    );
  }
}

export default connect(state => state)(Topics);
