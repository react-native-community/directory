import { Button } from '~/components/Button';
import { DownloadFileIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import tw from '~/util/tailwind';

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
          style={tw`bg-transparent`}
          containerStyle={tw`h-5`}
          href={`https://unpkg.com/${packageName}/${filePath}`}
          aria-label="Download file">
          <DownloadFileIcon
            height={20}
            width={20}
            style={tw`size-5 text-palette-gray4 dark:text-pewter`}
          />
        </Button>
      }>
      Download
    </Tooltip>
  );
}
