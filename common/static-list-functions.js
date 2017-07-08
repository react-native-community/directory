export const createNavigationItemsFromProps = props => [
  {
    text: 'Last Update',
    active: props.sortBy === 'updated',
    onClick: () => {
      return props.dispatch({
        sortBy: 'updated',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Recommended',
    active: props.sortBy === 'approved',
    onClick: () => {
      return props.dispatch({
        sortBy: 'approved',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Compatibility',
    active: props.sortBy === 'compatibility',
    onClick: () => {
      return props.dispatch({
        sortBy: 'compatibility',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Health',
    active: props.sortBy === 'health',
    onClick: () => {
      return props.dispatch({
        sortBy: 'health',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Downloads',
    active: props.sortBy === 'downloads',
    onClick: () => {
      return props.dispatch({
        sortBy: 'downloads',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Issues',
    active: props.sortBy === 'issues',
    onClick: () => {
      return props.dispatch({
        sortBy: 'issues',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Stars',
    active: props.sortBy === 'stars',
    onClick: () => {
      return props.dispatch({
        sortBy: 'stars',
        type: 'SORT_BY',
      });
    },
  },
];
