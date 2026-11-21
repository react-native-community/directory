import * as HoverCard from '@radix-ui/react-hover-card';
import { useState } from 'react';
import { ActivityIndicator, type ColorValue, useWindowDimensions, View } from 'react-native';

import { ThumbnailIcon } from '~/components/Icons';
import { cx } from '~/util/tailwind';

type Props = {
  url: string;
  alt: string;
};

const GITHUB_PREVIEW_MIN_WIDTH = 640;

function Thumbnail({ url, alt }: Props) {
  const { width, height } = useWindowDimensions();

  const [isLoaded, setLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const maxPreviewWidth = width < GITHUB_PREVIEW_MIN_WIDTH ? width : GITHUB_PREVIEW_MIN_WIDTH;
  const maxPreviewImageWidth = maxPreviewWidth - 20;
  const maxPreviewHeight = height / 2;
  const maxImgPreviewHeight = maxPreviewHeight - 20;

  return (
    <HoverCard.Root openDelay={0} closeDelay={0} onOpenChange={setShowPreview}>
      <HoverCard.Trigger asChild>
        <View
          tabIndex={0}
          className="border-palette-gray2 dark:border-border my-1 mr-2.5 box-border min-h-7.5 overflow-hidden rounded border p-1.5 pb-0 text-center">
          {showPreview && !isLoaded ? (
            <div className="mx-px -mt-0.5 w-3.5">
              <ActivityIndicator size="small" color={'var(--primary-dark)' as ColorValue} />
            </div>
          ) : (
            <ThumbnailIcon
              className={cx(
                'text-palette-gray3 dark:text-pewter',
                cx(showPreview && 'text-primary-dark')
              )}
            />
          )}
        </View>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content sideOffset={6} sticky="always">
          <View
            className={cx(
              'shadow-offset-0/0.5 shadow-radius-2 box-border hidden rounded-lg bg-white p-2.5 shadow-palette-gray3 dark:bg-black dark:shadow-accented',
              cx(showPreview && isLoaded && 'flex')
            )}
            style={[
              {
                maxWidth: maxPreviewWidth,
                maxHeight: maxPreviewHeight,
              },
            ]}>
            <img
              src={url}
              onLoad={() => setLoaded(true)}
              alt={alt}
              className="rounded"
              style={{
                maxWidth: maxPreviewImageWidth,
                maxHeight: maxImgPreviewHeight,
              }}
            />
          </View>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export default Thumbnail;
