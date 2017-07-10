import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TopicItem from '../components/TopicItem';

const generateTopicItemElements = (topics, list) => {
  return list.map(name => {
    return (
      <li key={`topic-list-${name}`} className="topics-item-wrapper">
        <style jsx>{`
          .topics-item-wrapper {
            display: block;
            margin: 6px 0 8px 0;
          }
        `}</style>
        <TopicItem count={topics[name]}>
          {name}
        </TopicItem>
      </li>
    );
  });
};

export default class Topics extends React.PureComponent {
  static propTypes = {
    topics: PropTypes.object,
    topicsList: PropTypes.array,
  };

  render() {
    const topicElements = generateTopicItemElements(
      this.props.topics,
      this.props.topicsList
    );
    return (
      <div className="topics">
        <style jsx>{`
          .topics {
            width: 100%;
            padding: 27px 0 8px 0;
          }

          .topics-heading {
            font-family: 'office-code-medium', monospace;
            font-weight: 400;
          }
        `}</style>
        <h2 className="topics-heading">Topics</h2>
        {topicElements}
      </div>
    );
  }
}
