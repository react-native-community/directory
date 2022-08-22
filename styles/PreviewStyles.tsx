import React, { useContext } from 'react';
import { useWindowDimensions } from 'react-native';

import { colors, darkColors } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';

const GITHUB_PREVIEW_MIN_WIDTH = 640;

// Note: styles must be done in this way in order to integrate with the image preview library.
// We should migrate to a more universal approach to thumbnails, built on top of React Native Web
const PreviewStyles = () => {
  const { isDark } = useContext(CustomAppearanceContext);
  const { width, height } = useWindowDimensions();

  const maxPreviewWidth = width < GITHUB_PREVIEW_MIN_WIDTH ? width : GITHUB_PREVIEW_MIN_WIDTH;
  const maxPreviewImageWidth = maxPreviewWidth - 20;
  const maxPreviewHeight = height / 2;
  const maxImgPreviewHeight = maxPreviewHeight - 20;

  return (
    <style>{`
      html,
      body {
        background-color: ${isDark ? darkColors.background : colors.white};
      }

      .preview {
        background-color: ${isDark ? darkColors.black : colors.white} !important;
        opacity: 1 !important;
        padding: 10px;
        box-sizing: border-box;
        box-shadow: 0 4px 6px 0 ${isDark ? '#2a2e3633' : '#00000025'} !important;
        max-width: ${maxPreviewWidth}px;
        max-height: ${maxPreviewHeight}px;
        border-radius: 3px;
        display: none;
      }

      .preview img {
        max-width: ${maxPreviewImageWidth}px;
        max-height: ${maxImgPreviewHeight}px;
        border-radius: 2px;
      }

      .preview.loaded {
        display: block;
      }
    `}</style>
  );
};

export default PreviewStyles;
