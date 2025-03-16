import { pluralize } from './strings';

export const TimeRange = Object.freeze({
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 60 * 60 * 24,
  WEEK: 60 * 60 * 24 * 7,
  MONTH: 60 * 60 * 24 * 30,
  YEAR: 60 * 60 * 24 * 365,
});

export function getTimeSinceToday(date: Date | string) {
  const updateTimeSeconds = new Date(date).getTime();
  const currentTimeSeconds = new Date().getTime();

  const seconds = Math.abs(currentTimeSeconds - updateTimeSeconds) / 1000;
  const elapsed = seconds > 0 ? seconds : 1;

  const [value, unit] =
    elapsed < TimeRange.MINUTE
      ? [Math.round(elapsed), 'second']
      : elapsed < TimeRange.HOUR
        ? [Math.round(elapsed / TimeRange.MINUTE), 'minute']
        : elapsed < TimeRange.DAY
          ? [Math.round(elapsed / TimeRange.HOUR), 'hour']
          : elapsed < TimeRange.WEEK
            ? [Math.round(elapsed / TimeRange.DAY), 'day']
            : elapsed < TimeRange.MONTH
              ? [Math.round(elapsed / TimeRange.WEEK), 'week']
              : elapsed < TimeRange.YEAR
                ? [Math.round(elapsed / TimeRange.MONTH), 'month']
                : [Math.round(elapsed / TimeRange.YEAR), 'year'];

  return `${value} ${pluralize(unit, value)} ago`;
}

export function isLaterThan(date: Date | string, timeRange: number) {
  const updateTimeSeconds = new Date(date).getTime();
  const currentTimeSeconds = new Date().getTime();
  const seconds = Math.abs(currentTimeSeconds - updateTimeSeconds) / 1000;
  return seconds > timeRange;
}
