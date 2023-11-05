import { pluralize } from './strings';

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

export const getTimeSinceToday = date => {
  const updateTimeSeconds = new Date(date).getTime();
  const currentTimeSeconds = new Date().getTime();

  const seconds = Math.abs(currentTimeSeconds - updateTimeSeconds) / 1000;
  const elapsed = seconds > 0 ? seconds : 1;

  const [value, unit] =
    elapsed < MINUTE
      ? [Math.round(elapsed), 'second']
      : elapsed < HOUR
      ? [Math.round(elapsed / MINUTE), 'minute']
      : elapsed < DAY
      ? [Math.round(elapsed / HOUR), 'hour']
      : elapsed < WEEK
      ? [Math.round(elapsed / DAY), 'day']
      : elapsed < MONTH
      ? [Math.round(elapsed / WEEK), 'week']
      : elapsed < YEAR
      ? [Math.round(elapsed / MONTH), 'month']
      : [Math.round(elapsed / YEAR), 'year'];

  return `${value} ${pluralize(unit, value)} ago`;
};
