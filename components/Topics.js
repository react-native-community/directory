import React from 'react';
import PropTypes from 'prop-types';
import TopicItem from '../components/TopicItem';
import data from '../build/data.json';
import { StyleSheet, css } from 'glamor/aphrodite';

const { topics, topicsList } = data;

let styles = StyleSheet.create({
  topics: {
    width: '100%',
    padding: '27px 0 8px 0',
  },
  heading: {
    fontFamily: `'office-code-medium', monospace`,
    fontWeight: '400',
  },
  wrapper: {
    display: 'block',
    margin: '6px 0 8px 0',
  },
});

const topicItems = topicsList.map(name => {
  return (
    <li key={`topic-list-${name}`} className={css(styles.wrapper)}>
      <TopicItem count={topics[name]}>
        {name}
      </TopicItem>
    </li>
  );
});

export default class Topics extends React.PureComponent {
  render() {
    return (
      <div className={css(styles.topics)}>
        <h2 className={css(styles.heading)}>Topics</h2>
        {topicItems}
      </div>
    );
  }
}
