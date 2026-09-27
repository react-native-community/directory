import {
  bufferFeature,
  controlsFeature,
  createPlayer,
  playbackFeature,
  playbackRateFeature,
  sourceFeature,
  timeFeature,
} from '@videojs/react';

export const InlinePlayer = createPlayer({
  features: [
    sourceFeature,
    playbackFeature,
    timeFeature,
    playbackRateFeature,
    bufferFeature,
    controlsFeature,
  ],
});
