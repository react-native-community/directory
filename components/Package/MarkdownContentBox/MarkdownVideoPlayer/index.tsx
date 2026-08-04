'use client';

import '@videojs/react/video/minimal-skin.css';

import { Container } from '@videojs/react';
import { Video } from '@videojs/react/video';
import { useState, type VideoHTMLAttributes } from 'react';
import { type Style } from 'twrnc';

import { P } from '~/common/styleguide';
import tw from '~/util/tailwind';

import { InlinePlayer } from './InlinePlayer';
import { MarkdownVideoPlayerUI } from './MarkdownVideoPlayerUI';

type Props = {
  src: VideoHTMLAttributes<HTMLVideoElement>['src'];
  style?: Style;
};

export default function MarkdownVideoPlayer({ src, style }: Props) {
  const [hasError, setHasError] = useState(false);
  return (
    <InlinePlayer.Provider>
      <Container
        className="media-minimal-skin media-minimal-skin--video relative mt-3 max-h-[592px] max-w-full"
        style={style}>
        {hasError ? (
          <P style={tw`text-center text-sm font-light leading-[150px] text-secondary`}>
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
    </InlinePlayer.Provider>
  );
}
