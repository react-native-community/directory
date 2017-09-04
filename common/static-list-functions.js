import * as Routing from '../common/routing';

export const createNavigationItemsFromProps = props => [
  {
    text: 'Last Update',
    isActive: props.sortBy === 'updated',
    href: `/updated${props.topic ? `/${props.topic}` : ''}`,
  },
  {
    text: 'Recommended',
    isActive: props.sortBy === 'recommended',
    href: `/recommended${props.topic ? `/${props.topic}` : ''}`,
  },
  {
    text: 'Quality',
    isActive: props.sortBy === 'quality',
    href: `/quality${props.topic ? `/${props.topic}` : ''}`,
  },
  {
    text: 'Downloads',
    isActive: props.sortBy === 'downloads',
    href: `/downloads${props.topic ? `/${props.topic}` : ''}`,
  },
  {
    text: 'Issues',
    isActive: props.sortBy === 'issues',
    href: `/issues${props.topic ? `/${props.topic}` : ''}`,
  },
  {
    text: 'Stars',
    isActive: props.sortBy === 'stars',
    href: `/stars${props.topic ? `/${props.topic}` : ''}`,
  },
];

export const createSupportItemsFromProps = props => [
  {
    text: 'iOS',
    isActive: props.support.ios
  },
  {
    text: 'Android',
    isActive: props.support.android,
  },
  {
    text: 'Expo',
    isActive: props.support.expo
  },
  {
    text: 'Web',
    isActive: props.support.web,
  },
];