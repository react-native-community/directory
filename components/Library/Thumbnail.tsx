import React, { memo, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ActivityIndicator } from 'react-native';
import { usePopper } from 'react-popper';

import { colors } from '../../common/styleguide';
import { Thumbnail as ThumbnailIcon } from '../Icons';

type Props = {
  url: string;
};

const Thumbnail = ({ url }: Props) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const iconRef = useRef();
  const previewRef = useRef();

  const { styles, attributes } = usePopper(iconRef.current, previewRef.current, {
    placement: 'bottom-end',
    strategy: 'fixed',
  });

  const handleMouseEvent = useCallback(() => {
    setShowPreview(!showPreview);
  }, [showPreview]);

  return (
    <>
      <a
        ref={iconRef}
        onMouseEnter={handleMouseEvent}
        onMouseLeave={handleMouseEvent}
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
          borderColor: colors.gray2,
          borderStyle: 'solid',
        }}>
        <ThumbnailIcon fill={showPreview ? colors.primary : undefined} />
      </a>
      {createPortal(
        <div ref={previewRef} style={styles.popper} {...attributes.popper}>
          {showPreview && (
            <div className={'preview' + (isLoaded ? ' loaded' : '')}>
              {isLoaded ? null : <ActivityIndicator size="small" />}
              <img src={url} onLoad={() => setLoaded(true)} />
            </div>
          )}
        </div>,
        document.querySelector('#__next')
      )}
    </>
  );
};

export default memo(Thumbnail);
