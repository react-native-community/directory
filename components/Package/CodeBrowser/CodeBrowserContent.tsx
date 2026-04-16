import { View } from 'react-native';
import { type Theme } from 'react-shiki';
import useSWR from 'swr';

import { Label, P } from '~/common/styleguide';
import { TempFileIcon } from '~/components/Icons';
import CodeBrowserContentHeader from '~/components/Package/CodeBrowser/CodeBrowserContentHeader';
import DownloadFileButton from '~/components/Package/CodeBrowser/DownloadFileButton';
import CopyButton from '~/components/Package/CopyButton';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';
import { TimeRange } from '~/util/datetime';
import tw from '~/util/tailwind';

import CodeBrowserContentHighlighter from './CodeBrowserContentHighlighter';

type Props = {
  packageName: string;
  filePath: string;
};

const PREVIEW_DISABLED = ['tgz', 'gz'];
const IMAGE_FILE = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

export default function CodeBrowserContent({ packageName, filePath }: Props) {
  const fileExtension = filePath.split('.').at(-1) ?? 'text';
  const isPreviewDisabled = PREVIEW_DISABLED.includes(fileExtension);
  const isImageFile = IMAGE_FILE.includes(fileExtension);

  const { data, isLoading } = useSWR<string>(
    !isPreviewDisabled && !isImageFile
      ? `/api/proxy/unpkg?name=${packageName}&path=${filePath}`
      : undefined,
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
        <CodeBrowserContentHeader filePath={filePath} />
        <View style={tw`flex flex-1 items-center justify-center`}>
          <ThreeDotsLoader />
        </View>
      </>
    );
  }

  if (!isLoading && data) {
    return (
      <>
        <CodeBrowserContentHeader filePath={filePath}>
          <View style={tw`flex flex-row gap-3`}>
            <DownloadFileButton filePath={filePath} packageName={packageName} />
            <CopyButton
              data={data}
              tooltip="Copy file content"
              label="Copy"
              style={tw`relative right-0 top-0`}
            />
          </View>
        </CodeBrowserContentHeader>
        <CodeBrowserContentHighlighter
          code={data}
          lang={filePath.split('.').at(-1) ?? 'text'}
          theme={(tw.prefixMatch('dark') ? rndDark : rndLight) as Theme}
        />
      </>
    );
  }

  return (
    <>
      <CodeBrowserContentHeader filePath={filePath}>
        <DownloadFileButton filePath={filePath} packageName={packageName} />
      </CodeBrowserContentHeader>
      <View style={tw`flex flex-1 items-center justify-center`}>
        {isImageFile && <img src={`https://unpkg.com/${packageName}/${filePath}`} alt="" />}
        {isPreviewDisabled && (
          <View style={tw`flex flex-col items-center gap-1`}>
            <TempFileIcon style={tw`mb-2 size-20 text-icon`} />
            <P>This file cannot be previewed.</P>
            <Label style={tw`font-normal text-secondary`}>Download file to see it locally.</Label>
          </View>
        )}
        {!isPreviewDisabled && !isImageFile && (
          <P>Cannot fetch &quot;{filePath}&quot; file content.</P>
        )}
      </View>
    </>
  );
}
