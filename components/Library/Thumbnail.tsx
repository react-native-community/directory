import React, { memo, useCallback, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ActivityIndicator } from 'react-native';
import { usePopper } from 'react-popper';

import { colors, darkColors } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Thumbnail as ThumbnailIcon } from '../Icons';

type Props = {
  url: string;
};

const customOffset = {
  name: 'offset',
  options: {
    offset: ({ placement, popper }) => {
      if (placement === 'right-start') {
        return [32, -30];
      } else {
        return [32, -popper.height + 80];
      }
    },
  },
};

const Thumbnail = ({ url }: Props) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const iconRef = useRef();
  const previewRef = useRef();

  const { styles, attributes } = usePopper(iconRef.current, previewRef.current, {
    placement: 'right-start',
    strategy: 'fixed',
    modifiers: [
      {
        name: 'preventOverflow',
        enabled: true,
        options: {
          rootBoundary: 'document',
        },
      },
      customOffset,
      {
        name: 'flip',
        enabled: true,
        options: {
          rootBoundary: 'document',
          fallbackPlacements: ['top-start'],
          allowedAutoPlacements: ['right-start', 'top-start'],
        },
      },
    ],
  });

  const handleMouseEvent = useCallback(show => setShowPreview(show), [showPreview]);
  const iconFill = isDark
    ? showPreview
      ? colors.primary
      : darkColors.pewter
    : showPreview
    ? colors.primary
    : undefined;

  return (
    <>
      <div
        ref={iconRef}
        onMouseEnter={() => handleMouseEvent(true)}
        onMouseLeave={() => handleMouseEvent(false)}
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
          borderColor: isDark ? darkColors.border : colors.gray2,
          borderStyle: 'solid',
        }}>
        {showPreview && !isLoaded ? (
          <div style={{ width: 14, marginLeft: 1, marginRight: 1, marginTop: -2 }}>
            <ActivityIndicator size="small" color={iconFill} />
          </div>
        ) : (
          <ThumbnailIcon fill={iconFill} />
        )}
      </div>
      {createPortal(
        <div ref={previewRef} style={styles.popper} {...attributes.popper}>
          {showPreview && (
            <div className={'preview' + (isLoaded ? ' loaded' : '')}>
              <img src={url} onLoad={() => setLoaded(true)} alt="" />
            </div>
          )}
        </div>,
        document.querySelector('#__next')
      )}
    </>
  );
};

export default memo(Thumbnail);
