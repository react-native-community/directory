import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TopicItem from '../components/TopicItem';

const compareAlphabetically = (a, b) => {
  return a === b ? 0 : a ? -1 : 1;
};

const generateTopicItemElements = topics => {
  const elements = [];
  const topicsArray = Object.keys(topics);

  topicsArray.sort(compareAlphabetically).forEach(name => {
    elements.push(
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

  return elements;
};

class Topics extends React.PureComponent {
  static propTypes = {
    topics: PropTypes.object,
  };

  render() {
    const topicElements = generateTopicItemElements(this.props.topics);
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
        {topicElements}
      </header>
    );
  }
}

export default connect(state => state)(Topics);
