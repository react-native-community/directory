import React from 'react';
import { useDimensions } from 'react-native-web-hooks';
import { colors } from '../common/styleguide';

const GITHUB_PREVIEW_MIN_WIDTH = 640;

// Note: styles must be done in this way in order to integrate with the image preview library.
// We should migrate to a more universal approach to thumbnails, built on top of React Native Web
const PreviewStyles = () => {
  const screenWidth = useDimensions().window.width;
  const previewWidth =
    screenWidth < GITHUB_PREVIEW_MIN_WIDTH ? screenWidth : GITHUB_PREVIEW_MIN_WIDTH;
  const previewImageWidth = previewWidth - 20;

  return (
    <style jsx global>{`
      .preview {
        background-color: white !important;
        opacity: 1 !important;
        padding: 10px !important;
        box-sizing: border-box;
        box-shadow: 0 5px 5px 0px #00000025 !important;
        max-width: ${previewWidth}px;
      }

      .preview img {
        max-width: ${previewImageWidth}px;
      }
    `}</style>
  );
};

export default PreviewStyles;
