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
        onMouseOver={handleMouseEvent}
        onMouseOut={handleMouseEvent}
        style={{ marginRight: 15, marginBottom: 8 }}>
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
