import React, { memo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { Thumbnail as ThumbnailIcon } from '../Icons';

interface ThumbnailProps {
  url: string;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const iconRef = useRef();
  const previewRef = useRef();
  const { styles, attributes } = usePopper(iconRef.current, previewRef.current, {
    // modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
    placement: 'bottom-end',
    strategy: 'fixed',
  });

  // callbacks
  const handleMouseEvent = () => {
    setShowPreview(!showPreview);
  };
  return (
    <>
      <a
        ref={iconRef}
        onMouseOver={handleMouseEvent}
        onMouseOut={handleMouseEvent}
        className="thumbnail-link">
        <ThumbnailIcon />
      </a>

      {ReactDOM.createPortal(
        <div ref={previewRef} style={styles.popper} {...attributes.popper}>
          {showPreview && (
            <div className="preview">
              <img src={url} />
            </div>
          )}
        </div>,
        document.querySelector('#__next')
      )}
    </>
  );
};

export default memo(Thumbnail);
