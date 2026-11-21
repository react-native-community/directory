import { Button } from '~/components/Button';
import { DownloadFileIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';

type Props = {
  packageName: string;
  filePath: string;
};

export default function DownloadFileButton({ packageName, filePath }: Props) {
  return (
    <Tooltip
      sideOffset={2}
      trigger={
        <Button
          className="bg-transparent"
          containerClassName="h-5"
          href={`https://unpkg.com/${packageName}/${filePath}`}
          aria-label="Download file">
          <DownloadFileIcon className="text-palette-gray4 dark:text-pewter size-5" />
        </Button>
      }>
      Download
    </Tooltip>
  );
}
