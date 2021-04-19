import React, { useContext } from 'react';
import { useDimensions } from 'react-native-web-hooks';

import { colors, darkColors } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';

const GITHUB_PREVIEW_MIN_WIDTH = 640;

// Note: styles must be done in this way in order to integrate with the image preview library.
// We should migrate to a more universal approach to thumbnails, built on top of React Native Web
const PreviewStyles = () => {
  const { isDark } = useContext(CustomAppearanceContext);
  const screenWidth = useDimensions().window.width;
  const previewWidth =
    screenWidth < GITHUB_PREVIEW_MIN_WIDTH ? screenWidth : GITHUB_PREVIEW_MIN_WIDTH;
  const previewImageWidth = previewWidth - 20;

  return (
    <style jsx global>{`
      html,
      body {
        background-color: ${isDark ? darkColors.background : colors.white};
      }

      .preview {
        background-color: ${isDark ? darkColors.black : colors.white} !important;
        opacity: 1 !important;
        padding: 10px !important;
        box-sizing: border-box;
        box-shadow: 0 4px 6px 0 ${isDark ? '#2a2e3633' : '#00000025'} !important;
        max-width: ${previewWidth}px;
        max-height: 66vh;
        border-radius: 3px;
      }

      .preview img {
        display: none;
        max-width: ${previewImageWidth}px;
        max-height: calc(66vh - 20px);
        border-radius: 2px;
      }

      .preview.loaded img {
        display: block;
      }
    `}</style>
  );
};

export default PreviewStyles;
