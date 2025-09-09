import * as HoverCard from '@radix-ui/react-hover-card';
import { useContext, memo, useState } from 'react';
import { ActivityIndicator, useWindowDimensions } from 'react-native';

import { colors, darkColors } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

import { Thumbnail as ThumbnailIcon } from '../Icons';

type Props = {
  url: string;
};

const GITHUB_PREVIEW_MIN_WIDTH = 640;

function Thumbnail({ url }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { width, height } = useWindowDimensions();

  const maxPreviewWidth = width < GITHUB_PREVIEW_MIN_WIDTH ? width : GITHUB_PREVIEW_MIN_WIDTH;
  const maxPreviewImageWidth = maxPreviewWidth - 20;
  const maxPreviewHeight = height / 2;
  const maxImgPreviewHeight = maxPreviewHeight - 20;

  const [isLoaded, setLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const iconFill = isDark
    ? showPreview
      ? colors.primary
      : darkColors.pewter
    : showPreview
      ? colors.primary
      : undefined;

  return (
    <HoverCard.Root openDelay={0} closeDelay={0} onOpenChange={open => setShowPreview(open)}>
      <HoverCard.Trigger asChild>
        <div
          tabIndex={0}
          style={{
            marginRight: 10,
            marginTop: 4,
            marginBottom: 4,
            padding: 6,
            paddingBottom: 0,
            minHeight: 30,
            boxSizing: 'border-box',
            overflow: 'hidden',
            textAlign: 'center',
            borderWidth: 1,
            borderRadius: 3,
            borderStyle: 'solid',
            borderColor: isDark ? darkColors.border : colors.gray2,
            cursor: isLoaded ? 'pointer' : 'progress',
          }}>
          {showPreview && !isLoaded ? (
            <div style={{ width: 14, marginLeft: 1, marginRight: 1, marginTop: -2 }}>
              <ActivityIndicator size="small" color={iconFill} />
            </div>
          ) : (
            <ThumbnailIcon fill={iconFill} />
          )}
        </div>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content sideOffset={6} sticky="always">
          <div
            style={{
              opacity: 1,
              padding: 10,
              borderRadius: 4,
              boxSizing: 'border-box',
              backgroundColor: isDark ? darkColors.black : colors.white,
              maxWidth: maxPreviewWidth,
              maxHeight: maxPreviewHeight,
              display: showPreview && isLoaded ? 'block' : 'none',
              boxShadow: `0 4px 6px 0 ${isDark ? '#2a2e3633' : '#00000025'}`,
            }}>
            <img
              src={url}
              onLoad={() => setLoaded(true)}
              alt=""
              style={{
                borderRadius: 2,
                maxWidth: maxPreviewImageWidth,
                maxHeight: maxImgPreviewHeight,
              }}
            />
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export default memo(Thumbnail);
