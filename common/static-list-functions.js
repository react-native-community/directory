import * as Routing from '../common/routing';

export const createNavigationItemsFromProps = props => [
  {
    text: 'Last Update',
    active: props.sortBy === 'updated',
    onClick: () => {
      Routing.push(`/updated${props.topic ? `/${props.topic}` : ''}`);
    },
  },
  {
    text: 'Recommended',
    active: props.sortBy === 'recommended',
    onClick: () => {
      Routing.push(`/recommended${props.topic ? `/${props.topic}` : ''}`);
    },
  },
  {
    text: 'Compatibility',
    active: props.sortBy === 'compatibility',
    onClick: () => {
      Routing.push(`/compatibility${props.topic ? `/${props.topic}` : ''}`);
    },
  },
  {
    text: 'Health',
    active: props.sortBy === 'health',
    onClick: () => {
      Routing.push(`/health${props.topic ? `/${props.topic}` : ''}`);
    },
  },
  {
    text: 'Downloads',
    active: props.sortBy === 'downloads',
    onClick: () => {
      Routing.push(`/downloads${props.topic ? `/${props.topic}` : ''}`);
    },
  },
  {
    text: 'Issues',
    active: props.sortBy === 'issues',
    onClick: () => {
      Routing.push(`/issues${props.topic ? `/${props.topic}` : ''}`);
    },
  },
  {
    text: 'Stars',
    active: props.sortBy === 'stars',
    onClick: () => {
      Routing.push(`/stars${props.topic ? `/${props.topic}` : ''}`);
    },
  },
];
