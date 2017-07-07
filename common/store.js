import { createStore } from 'redux';

import data from '../build/data.json';
import * as Sorting from '../common/sorting';

const topics = {};
const originalData = [...data.incompatible, ...data.expo];

[...originalData].forEach(project => {
  project.github.topics.forEach(topic => {
    if (!topics[topic]) {
      topics[topic] = 1;
      return;
    }

    topics[topic] += 1;
    return;
  });
});

const INITIAL_STATE = {
  libraries: [...originalData],
  topics,
  search: '',
  sortBy: 'all',
  topic: undefined,
};

const handleSorting = (state, sortBy) => {
  if (sortBy === 'approved') {
    return Sorting.approved(state, [...originalData], sortBy);
  }

  if (sortBy === 'compatibility') {
    return Sorting.compatibility(state, [...originalData], sortBy);
  }

  if (sortBy === 'issues') {
    return Sorting.issues(state, [...originalData], sortBy);
  }

  if (sortBy === 'stars') {
    return Sorting.stars(state, [...originalData], sortBy);
  }

  if (sortBy === 'downloads') {
    return Sorting.downloads(state, [...originalData], sortBy);
  }

  if (sortBy === 'updated') {
    return Sorting.updated(state, [...originalData], sortBy);
  }

  if (sortBy === 'health') {
    return Sorting.health(state, [...originalData], sortBy);
  }

  return { ...state, libraries: [...originalData], sortBy };
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SORT_BY':
      return handleSorting(state, action.sortBy);
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
