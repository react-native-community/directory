'use client';

import '@videojs/react/video/minimal-skin.css';

import { Container } from '@videojs/react';
import { Video } from '@videojs/react/video';
import { type Style } from 'twrnc';

import { InlinePlayer } from './InlinePlayer';
import { MarkdownVideoPlayerUI } from './MarkdownVideoPlayerUI';

type Props = {
  src: string;
  style?: Style;
};

export function MarkdownVideoPlayer({ src, style }: Props) {
  return (
    <InlinePlayer.Provider>
      <Container
        className="media-minimal-skin media-minimal-skin--video relative"
        style={{ maxWidth: '100%', ...style }}>
        <Video src={src} playsInline muted className="max-h-[580px]" />
        <MarkdownVideoPlayerUI />
      </Container>
    </InlinePlayer.Provider>
  );
}
