import { BufferingIndicator, ErrorDialog } from '@videojs/react';

import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';

import { InlinePlayer } from './InlinePlayer';
import { MarkdownVideoPlayerControls } from './MarkdownVideoPlayerControls';

export function MarkdownVideoPlayerUI() {
  const store = InlinePlayer.usePlayer(({ canPlay }) => ({ canPlay }));

  if (!store.canPlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <ThreeDotsLoader />
      </div>
    );
  }

  return (
    <>
      <BufferingIndicator
        render={props => (
          <div {...props} className="media-buffering-indicator">
            <ThreeDotsLoader />
          </div>
        )}
      />
      <ErrorDialog.Root>
        <ErrorDialog.Popup className="media-error">
          <div className="media-error__dialog">
            <div className="media-error__content">
              <ErrorDialog.Title className="media-error__title">
                Something went wrong.
              </ErrorDialog.Title>
              <ErrorDialog.Description className="media-error__description" />
            </div>
            <div className="media-error__actions">
              <ErrorDialog.Close className="media-button media-button--primary">
                OK
              </ErrorDialog.Close>
            </div>
          </div>
        </ErrorDialog.Popup>
      </ErrorDialog.Root>
      <MarkdownVideoPlayerControls />
      <div className="media-overlay" />
    </>
  );
}
