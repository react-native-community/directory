import { type SyntheticEvent, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { type Theme } from 'react-shiki';
import useSWR from 'swr';

import { Label, P } from '~/common/styleguide';
import {
  CodeIcon,
  ImageFileIcon,
  MaximizeIcon,
  MinimizeIcon,
  TempFileIcon,
} from '~/components/Icons';
import InputKeyHint from '~/components/InputKeyHint';
import CopyButton from '~/components/Package/CopyButton';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import Tooltip from '~/components/Tooltip';
import rndDark from '~/styles/shiki/rnd-dark.json';
import rndLight from '~/styles/shiki/rnd-light.json';
import { type UnpkgMeta } from '~/types';
import { IMAGE_FILES, PREVIEW_DISABLED_FILES } from '~/util/codeBrowser';
import { TimeRange } from '~/util/datetime';
import { formatBytes } from '~/util/formatBytes';
import { pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

import CodeBrowserContentFooter from './CodeBrowserContentFooter';
import CodeBrowserContentHeader from './CodeBrowserContentHeader';
import CodeBrowserContentHighlighter from './CodeBrowserContentHighlighter';
import DownloadFileButton from './DownloadFileButton';

type Props = {
  packageName: string;
  isBrowserMaximized: boolean;
  toggleMaximized: () => void;
  filePath: string;
  fileData?: UnpkgMeta['files'][number];
};

export default function CodeBrowserContent({
  packageName,
  isBrowserMaximized,
  toggleMaximized,
  filePath,
  fileData,
}: Props) {
  const [rawPreview, setRawPreview] = useState(false);
  const [imageData, setImageData] = useState<
    SyntheticEvent<HTMLImageElement>['currentTarget'] | null
  >(null);

  useEffect(() => {
    setImageData(null);
  }, [filePath]);

  const fileExtension = filePath.split('.').at(-1) ?? 'text';
  const isTooBig = Boolean(fileData?.size && fileData.size > 1024 * 1024 * 4);
  const isPreviewDisabled = PREVIEW_DISABLED_FILES.includes(fileExtension) || isTooBig;
  const isImageFile = IMAGE_FILES.includes(fileExtension);
  const allowRawPreview = isImageFile && filePath.endsWith('.svg');

  const { data, isLoading } = useSWR<string>(
    !isPreviewDisabled && (!isImageFile || (isImageFile && rawPreview))
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

  const maximizeBrowserButton = (
    <Tooltip
      trigger={
        <Pressable onPress={toggleMaximized}>
          {isBrowserMaximized ? (
            <MinimizeIcon style={tw`size-5 text-palette-gray4 dark:text-pewter`} />
          ) : (
            <MaximizeIcon style={tw`size-5 text-palette-gray4 dark:text-pewter`} />
          )}
        </Pressable>
      }>
      {isBrowserMaximized ? (
        <View style={tw`-mr-1 flex flex-row items-center gap-1.5`}>
          <span>Minimize code browser</span>
          <InputKeyHint content={[{ key: 'Esc' }]} />
        </View>
      ) : (
        'Maximize code browser'
      )}
    </Tooltip>
  );

  if (isLoading) {
    return (
      <>
        <CodeBrowserContentHeader filePath={filePath}>
          {maximizeBrowserButton}
        </CodeBrowserContentHeader>
        <View style={tw`flex flex-1 items-center justify-center`}>
          <ThreeDotsLoader />
        </View>
        <CodeBrowserContentFooter
          rightSlot={
            fileData && (
              <Label style={tw`font-light text-secondary`}>
                <span style={tw`font-medium`}>{formatBytes(fileData.size)}</span>
              </Label>
            )
          }
        />
      </>
    );
  }

  if (!isLoading && data && typeof data === 'string') {
    return (
      <>
        <CodeBrowserContentHeader filePath={filePath}>
          <View style={tw`flex flex-row gap-3`}>
            {allowRawPreview && (
              <Tooltip
                trigger={
                  <Pressable onPress={() => setRawPreview(false)}>
                    <ImageFileIcon style={tw`size-5 text-palette-gray4 dark:text-pewter`} />
                  </Pressable>
                }>
                Show image preview
              </Tooltip>
            )}
            <DownloadFileButton filePath={filePath} packageName={packageName} />
            <CopyButton
              data={data}
              tooltip="Copy file content"
              label="Copy"
              style={tw`relative right-0 top-0`}
            />
            {maximizeBrowserButton}
          </View>
        </CodeBrowserContentHeader>
        <CodeBrowserContentHighlighter
          code={data}
          lang={filePath.split('.').at(-1) ?? 'text'}
          theme={(tw.prefixMatch('dark') ? rndDark : rndLight) as Theme}
        />
        <CodeBrowserContentFooter
          leftSlot={
            <Label style={tw`font-light text-secondary`}>
              <span style={tw`font-medium`}>{data.split('\n').length}</span>{' '}
              {pluralize('line', data.split('\n').length)}
            </Label>
          }
          rightSlot={
            fileData && (
              <Label style={tw`font-light text-secondary`}>
                <span style={tw`font-medium`}>{formatBytes(fileData.size)}</span>
              </Label>
            )
          }
        />
      </>
    );
  }

  return (
    <>
      <CodeBrowserContentHeader filePath={filePath}>
        <View style={tw`flex flex-row gap-3`}>
          {allowRawPreview && !rawPreview && (
            <Tooltip
              trigger={
                <Pressable onPress={() => setRawPreview(true)}>
                  <CodeIcon style={tw`size-5 text-palette-gray4 dark:text-pewter`} />
                </Pressable>
              }>
              Show code
            </Tooltip>
          )}
          {(isPreviewDisabled || isImageFile) && (
            <DownloadFileButton filePath={filePath} packageName={packageName} />
          )}
          {maximizeBrowserButton}
        </View>
      </CodeBrowserContentHeader>
      <View style={tw`flex flex-1 items-center justify-center`}>
        {isImageFile && (
          <>
            <img
              key={filePath}
              src={`https://unpkg.com/${packageName}/${filePath}`}
              alt={filePath}
              style={tw`max-h-full max-w-full`}
              onLoad={(event: SyntheticEvent<HTMLImageElement>) => {
                setImageData(event.currentTarget);
              }}
            />
            {!imageData && <ThreeDotsLoader />}
          </>
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
            Cannot fetch <code style={tw`text-[90%]`}>&quot;{filePath}&quot;</code> file content.
          </P>
        )}
      </View>
      <CodeBrowserContentFooter
        leftSlot={
          isImageFile && imageData ? (
            <Label style={tw`font-light text-secondary`}>
              <span style={tw`font-medium`}>{imageData.naturalWidth}</span>px &times;{' '}
              <span style={tw`font-medium`}>{imageData.naturalHeight}</span>px
            </Label>
          ) : undefined
        }
        rightSlot={
          fileData && (
            <Label style={tw`font-light text-secondary`}>
              <span style={tw`font-medium`}>{formatBytes(fileData.size)}</span>
            </Label>
          )
        }
      />
    </>
  );
}
