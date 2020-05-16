import React from 'react';
import { useDimensions } from 'react-native-web-hooks';
import { colors } from '../common/styleguide';

const GITHUB_PREVIEW_MIN_WIDTH = 640;
const GITHUB_PREVIEW_MIN_HEIGHT = 320;

const PreviewStyles = () => {
  const screenWidth = useDimensions().window.width;
  const previewWidth =
    screenWidth < GITHUB_PREVIEW_MIN_WIDTH ? screenWidth : GITHUB_PREVIEW_MIN_WIDTH;
  const previewImageWidth = previewWidth - 20;

  //
  // height: ${previewHeight}px;

  // max-width: ${previewImageWidth}px;
  // max-height: ${GITHUB_PREVIEW_MIN_HEIGHT}px;
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

      .thumbnail-link {
        cursor: pointer !important;
        margin-right: 6px !important;
      }

      .thumbnail-link:hover path {
        fill: ${colors.primary} !important;
      }
    `}</style>
  );
};

export default PreviewStyles;
