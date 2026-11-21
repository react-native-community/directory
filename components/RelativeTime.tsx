import { Label } from '~/common/styleguide';
import { Tooltip } from '~/components/Tooltip';
import { getTimeSinceToday } from '~/util/datetime';

type Props = {
  time: string;
  dateOnly?: boolean;
};

export default function RelativeTime({ time, dateOnly }: Props) {
  return (
    <Tooltip
      trigger={<time dateTime={time}>{getTimeSinceToday(time)}</time>}
      sideOffset={0}
      delayDuration={500}>
      <Label className="font-light text-white">
        {dateOnly
          ? new Date(time).toLocaleDateString('en-US')
          : new Date(time).toLocaleString('en-US')}
      </Label>
    </Tooltip>
  );
}
