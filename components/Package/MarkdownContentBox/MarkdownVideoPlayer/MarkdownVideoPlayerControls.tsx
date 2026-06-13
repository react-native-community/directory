import {
  Controls,
  PlaybackRateButton,
  PlayButton,
  SeekButton,
  Slider,
  Time,
  TimeSlider,
} from '@videojs/react';

import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import Tooltip from '~/components/Tooltip';

import { PauseIcon, PlayIcon, RestartIcon, SeekIcon } from './icons';
import { InlinePlayer } from './InlinePlayer';
import { MarkdownVideoPlayerButton } from './MarkdownVideoPlayerButton';

const SEEK_TIME = 5;

export function MarkdownVideoPlayerControls() {
  const store = InlinePlayer.usePlayer(({ started, paused, ended }) => ({
    paused,
    ended,
    started,
  }));

  return (
    <Controls.Root className="media-controls">
      <div className="media-button-group">
        <Tooltip
          sideOffset={2}
          trigger={
            <PlayButton className="media-button--play" render={<MarkdownVideoPlayerButton />}>
              <RestartIcon className="media-icon media-icon--restart" />
              <PlayIcon className="media-icon media-icon--play" />
              <PauseIcon className="media-icon media-icon--pause" />
            </PlayButton>
          }>
          <span className="text-xs">
            {store.ended ? 'Replay' : store.paused || !store.started ? 'Play' : 'Pause'}
          </span>
        </Tooltip>
        <Tooltip
          sideOffset={2}
          trigger={
            <SeekButton
              seconds={-SEEK_TIME}
              className="media-button--seek"
              render={<MarkdownVideoPlayerButton />}>
              <span className="media-icon__container">
                <SeekIcon className="media-icon media-icon--seek media-icon--flipped" />
                <span className="media-icon__label">{SEEK_TIME}</span>
              </span>
            </SeekButton>
          }>
          <span className="text-xs">Seek backward {SEEK_TIME} seconds</span>
        </Tooltip>
        <Tooltip
          sideOffset={2}
          trigger={
            <SeekButton
              seconds={SEEK_TIME}
              className="media-button--seek"
              render={<MarkdownVideoPlayerButton />}>
              <span className="media-icon__container">
                <SeekIcon className="media-icon media-icon--seek" />
                <span className="media-icon__label">{SEEK_TIME}</span>
              </span>
            </SeekButton>
          }>
          <span className="text-xs">Seek forward {SEEK_TIME} seconds</span>
        </Tooltip>
      </div>
      <div className="media-time-controls">
        <Time.Group className="media-time-group">
          <Time.Value type="current" className="media-time media-time--current" />
          <Time.Separator className="media-time-separator" />
          <Time.Value type="duration" className="media-time media-time--duration" />
        </Time.Group>
        <TimeSlider.Root className="media-slider">
          <TimeSlider.Track className="media-slider__track">
            <TimeSlider.Fill className="media-slider__fill" />
            <TimeSlider.Buffer className="media-slider__buffer" />
          </TimeSlider.Track>
          <TimeSlider.Thumb className="media-slider__thumb" />
          <div className="media-preview media-slider__preview">
            <div className="media-preview__thumbnail-wrapper">
              <Slider.Thumbnail className="media-preview__thumbnail" />
            </div>
            <TimeSlider.Value type="pointer" className="media-time media-preview__time" />
            <ThreeDotsLoader />
          </div>
        </TimeSlider.Root>
      </div>
      <div className="media-button-group">
        <Tooltip
          sideOffset={2}
          trigger={
            <PlaybackRateButton
              className="media-button--playback-rate"
              render={<MarkdownVideoPlayerButton />}
            />
          }>
          <span className="text-xs">Toggle playback rate</span>
        </Tooltip>
      </div>
    </Controls.Root>
  );
}
