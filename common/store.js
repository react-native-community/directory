import { createStore } from 'redux';

import data from '../build/data.json';

const topics = {};
const all = [...data.imcompatible, ...data.expo];

all.forEach(repo => {
  repo.topics.forEach(topic => {
    if (!topics[topic]) {
      topics[topic] = 1;
      return;
    }

    topics[topic] += 1;
    return;
  });
});

const INITIAL_STATE = {
  all,
  expo: data.expo,
  topics,
  search: '',
  topic: undefined,
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SEARCH_LIBRARY':
      return { ...state, search: action.value };
    case 'TOPIC_PICKED':
      return { ...state, topic: action.value, search: '' };
    case 'CLEAR_TOPIC':
      return { ...state, topic: '' };
    case 'CLEAR_SEARCH':
      return { ...state, search: '' };
    default:
      return state;
  }
};

export const initStore = initialState => {
  return createStore(reducer, initialState);
};
