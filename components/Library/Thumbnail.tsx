import * as HoverCard from '@radix-ui/react-hover-card';
import { memo, useState } from 'react';
import { ActivityIndicator, type ColorValue, useWindowDimensions, View } from 'react-native';

import tw from '~/util/tailwind';

import { Thumbnail as ThumbnailIcon } from '../Icons';

type Props = {
  url: string;
};

const GITHUB_PREVIEW_MIN_WIDTH = 640;

function Thumbnail({ url }: Props) {
  const { width, height } = useWindowDimensions();

  const [isLoaded, setLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const maxPreviewWidth = width < GITHUB_PREVIEW_MIN_WIDTH ? width : GITHUB_PREVIEW_MIN_WIDTH;
  const maxPreviewImageWidth = maxPreviewWidth - 20;
  const maxPreviewHeight = height / 2;
  const maxImgPreviewHeight = maxPreviewHeight - 20;

  return (
    <HoverCard.Root openDelay={0} closeDelay={0} onOpenChange={open => setShowPreview(open)}>
      <HoverCard.Trigger asChild>
        <View
          tabIndex={0}
          style={tw`mr-2.5 my-1 p-1.5 pb-0 min-h-7.5 box-border overflow-hidden text-center rounded border border-palette-gray2 dark:border-default`}>
          {showPreview && !isLoaded ? (
            <div style={tw`w-3.5 mx-px -mt-0.5`}>
              <ActivityIndicator size="small" color={tw`text-primary-dark`.color as ColorValue} />
            </div>
          ) : (
            <ThumbnailIcon
              style={[
                tw`text-palette-gray3 dark:text-pewter`,
                showPreview && tw`text-primary-dark`,
              ]}
            />
          )}
        </View>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content sideOffset={6} sticky="always">
          <View
            style={[
              tw`p-2.5 rounded-lg box-border hidden shadow-offset-0/0.5 shadow-radius-2 shadow-palette-gray3 bg-white dark:shadow-accented dark:bg-black`,
              showPreview && isLoaded && tw`flex`,
              {
                maxWidth: maxPreviewWidth,
                maxHeight: maxPreviewHeight,
              },
            ]}>
            <img
              src={url}
              onLoad={() => setLoaded(true)}
              alt=""
              style={{
                ...tw`rounded`,
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

export default memo(Thumbnail);
