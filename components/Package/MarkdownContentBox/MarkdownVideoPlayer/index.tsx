'use client';

import { Container } from '@videojs/react';
import { Video } from '@videojs/react/video';
import { type CSSProperties, useState, type VideoHTMLAttributes } from 'react';

import { P } from '~/common/styleguide';
import styles from '~/styles/markdown-video-player.module.css';

import { InlinePlayer } from './InlinePlayer';
import { MarkdownVideoPlayerUI } from './MarkdownVideoPlayerUI';

type Props = {
  src: VideoHTMLAttributes<HTMLVideoElement>['src'];
  style?: CSSProperties;
};

export default function MarkdownVideoPlayer({ src, style }: Props) {
  const [hasError, setHasError] = useState(false);
  return (
    <InlinePlayer>
      <Container
        className={`${styles.player} media-minimal-skin relative mt-3 max-h-[592px] max-w-full`}
        style={style}>
        {hasError ? (
          <P className="text-tertiary flex items-center justify-center text-sm leading-[150px] font-light">
            Unable to load video source
          </P>
        ) : (
          <>
            <Video
              src={src}
              playsInline
              muted
              className="max-h-[592px]"
              onError={() => setHasError(true)}
            />
            <MarkdownVideoPlayerUI />
          </>
        )}
      </Container>
    </InlinePlayer>
  );
}
