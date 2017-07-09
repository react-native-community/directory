export const createNavigationItemsFromProps = props => [
  {
    text: 'Last Update',
    active: props.sortBy === 'updated',
    onClick: () => {
      window.location.href = '/updated';
    },
  },
  {
    text: 'Recommended',
    active: props.sortBy === 'recommended',
    onClick: () => {
      window.location.href = '/recommended';
    },
  },
  {
    text: 'Compatibility',
    active: props.sortBy === 'compatibility',
    onClick: () => {
      window.location.href = '/compatibility';
    },
  },
  {
    text: 'Health',
    active: props.sortBy === 'health',
    onClick: () => {
      window.location.href = '/health';
    },
  },
  {
    text: 'Downloads',
    active: props.sortBy === 'downloads',
    onClick: () => {
      window.location.href = '/downloads';
    },
  },
  {
    text: 'Issues',
    active: props.sortBy === 'issues',
    onClick: () => {
      window.location.href = '/issues';
    },
  },
  {
    text: 'Stars',
    active: props.sortBy === 'stars',
    onClick: () => {
      window.location.href = '/stars';
    },
  },
];
