import React from 'react';
import { useDimensions } from 'react-native-web-hooks';
import ReactTooltip from 'react-tooltip';
import { colors } from '../common/styleguide';

const GITHUB_PREVIEW_MIN_WIDTH = 640;
const GITHUB_PREVIEW_MIN_HEIGHT = 320;

const Tooltip = () => {
  const screenWidth = useDimensions().window.width;
  const previewWidth =
    screenWidth < GITHUB_PREVIEW_MIN_WIDTH ? screenWidth : GITHUB_PREVIEW_MIN_WIDTH;
  const previewHeight = GITHUB_PREVIEW_MIN_HEIGHT + 20;
  const previewImageWidth = previewWidth - 20;
  return (
    <>
      <ReactTooltip
        className="preview"
        id="preview"
        place="bottom"
        type="light"
        effect="solid"
        arrowColor="transparent"
        getContent={dataTip => <img src={dataTip} />}
        overridePosition={({ left, top }, currentEvent, currentTarget, node) => {
          const d = document.documentElement;
          left = Math.min(d.clientWidth - previewWidth, left);
          top = Math.min(d.clientHeight - previewHeight, top);
          left = Math.max(0, left);
          top = Math.max(0, top);
          return { top, left };
        }}
      />
      <style jsx global>{`
        .preview {
          background-color: white !important;
          opacity: 1 !important;
          padding: 10px !important;
          box-shadow: 0 5px 5px 0px #00000025 !important;
        }

        .preview img {
          max-width: ${previewImageWidth}px;
          max-height: ${GITHUB_PREVIEW_MIN_HEIGHT}px;
        }

        .thumbnail-link {
          cursor: pointer !important;
          margin-right: 6px !important;
        }

        .thumbnail-link:hover path {
          fill: ${colors.primary} !important;
        }
      `}</style>
    </>
  );
};

export default Tooltip;
