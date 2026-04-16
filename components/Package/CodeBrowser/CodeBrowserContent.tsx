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
import { type UnpkgMeta } from '~/types';
import { IMAGE_FILES, PREVIEW_DISABLED_FILES } from '~/util/codeBrowser';
import { TimeRange } from '~/util/datetime';
import { formatBytes } from '~/util/formatBytes';
import tw from '~/util/tailwind';

import CodeBrowserContentHighlighter from './CodeBrowserContentHighlighter';

type Props = {
  packageName: string;
  filePath: string;
  fileData?: UnpkgMeta['files'][number];
};

export default function CodeBrowserContent({ packageName, filePath, fileData }: Props) {
  const fileExtension = filePath.split('.').at(-1) ?? 'text';

  const isTooBig = Boolean(fileData?.size && fileData.size > 1024 * 1024 * 4);
  const isPreviewDisabled = PREVIEW_DISABLED_FILES.includes(fileExtension) || isTooBig;
  const isImageFile = IMAGE_FILES.includes(fileExtension);

  const { data, isLoading } = useSWR<string>(
    !isPreviewDisabled && !isImageFile
      ? `/api/proxy/unpkg?name=${packageName}&path=${filePath.replaceAll('+', '%2B')}`
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

  if (!isLoading && data && typeof data === 'string') {
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
        {(isPreviewDisabled ?? isImageFile) && (
          <DownloadFileButton filePath={filePath} packageName={packageName} />
        )}
      </CodeBrowserContentHeader>
      <View style={tw`flex flex-1 items-center justify-center`}>
        {isImageFile && (
          <img
            src={`https://unpkg.com/${packageName}/${filePath}`}
            alt=""
            style={tw`max-h-full max-w-full`}
          />
        )}
        {!isImageFile && isPreviewDisabled && (
          <View style={tw`flex flex-col items-center gap-1`}>
            <TempFileIcon style={tw`mb-2 size-20 text-tertiary dark:text-accented`} />
            <P>
              {fileData?.size && isTooBig
                ? `This file is too big (${formatBytes(fileData?.size)}), and cannot be previewed.`
                : 'This file cannot be previewed.'}
            </P>
            <Label style={tw`font-normal text-secondary`}>Download file to see it locally.</Label>
          </View>
        )}
        {!isPreviewDisabled && !isImageFile && (
          <P>
            Cannot fetch &quot;<code>{filePath}</code>&quot; file content.
          </P>
        )}
      </View>
    </>
  );
}
