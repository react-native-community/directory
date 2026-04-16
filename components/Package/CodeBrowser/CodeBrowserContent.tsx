import { View } from 'react-native';
import { type Theme } from 'react-shiki';
import useSWR from 'swr';

import { P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { DownloadFileIcon } from '~/components/Icons';
import CopyButton from '~/components/Package/CopyButton';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import Tooltip from '~/components/Tooltip';
import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';
import { TimeRange } from '~/util/datetime';
import tw from '~/util/tailwind';

import CodeBrowserContentHighlighter from './CodeBrowserContentHighlighter';

type Props = {
  packageName: string;
  filePath: string;
};

export default function CodeBrowserContent({ packageName, filePath }: Props) {
  const { data, isLoading } = useSWR<string>(
    `/api/proxy/unpkg?name=${packageName}&path=${filePath}`,
    (url: string) =>
      fetch(url).then(res => {
        if (res.status === 200) {
          return res.text();
        }
        return res.json();
      }),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return (
      <>
        <View style={tw`min-h-[45px] border-b border-palette-gray2 px-4 py-3 dark:border-default`}>
          <P style={tw`font-mono mt-px font-bold`}>{filePath}</P>
        </View>
        <View style={tw`flex flex-1 items-center justify-center bg-white dark:bg-[#0d1117]`}>
          <ThreeDotsLoader />
        </View>
      </>
    );
  }

  if (!isLoading && data) {
    return (
      <>
        <View
          style={tw`flex min-h-[45px] flex-row justify-between border-b border-palette-gray2 px-4 py-3 dark:border-default`}>
          <P style={tw`font-mono mt-px font-bold`}>{filePath}</P>
          <View style={tw`flex flex-row gap-3`}>
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
            <CopyButton
              data={data}
              tooltip="Copy file content"
              label="Copy"
              style={tw`relative right-0 top-0`}
            />
          </View>
        </View>
        <CodeBrowserContentHighlighter
          code={data}
          lang={filePath.split('.').at(-1) ?? 'text'}
          theme={(tw.prefixMatch('dark') ? rndDark : rndLight) as Theme}
        />
      </>
    );
  }

  return <P>Cannot fetch &quot;{filePath}&quot; file content.</P>;
}
