import * as HoverCard from '@radix-ui/react-hover-card';
import { memo, useState } from 'react';
import { ActivityIndicator, type ColorValue, useWindowDimensions, View } from 'react-native';

import { Thumbnail as ThumbnailIcon } from '~/components/Icons';
import tw from '~/util/tailwind';

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
    <HoverCard.Root openDelay={0} closeDelay={0} onOpenChange={setShowPreview}>
      <HoverCard.Trigger asChild>
        <View
          tabIndex={0}
          style={tw`min-h-7.5 my-1 mr-2.5 box-border overflow-hidden rounded border border-palette-gray2 p-1.5 pb-0 text-center dark:border-default`}>
          {showPreview && !isLoaded ? (
            <div style={tw`mx-px -mt-0.5 w-3.5`}>
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
              tw`shadow-offset-0/0.5 shadow-radius-2 box-border hidden rounded-lg bg-white p-2.5 shadow-palette-gray3 dark:bg-black dark:shadow-accented`,
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
