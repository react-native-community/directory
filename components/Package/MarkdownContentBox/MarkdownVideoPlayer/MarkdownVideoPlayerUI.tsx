import { BufferingIndicator, ErrorDialog } from '@videojs/react';

import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import styles from '~/styles/markdown-video-player.module.css';

import { usePlayer } from './InlinePlayer';
import { MarkdownVideoPlayerControls } from './MarkdownVideoPlayerControls';

export function MarkdownVideoPlayerUI() {
  const store = usePlayer(({ canPlay }) => ({ canPlay }));

  if (!store.canPlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <ThreeDotsLoader />
      </div>
    );
  }

  return (
    <>
      <BufferingIndicator />
      <ErrorDialog.Root>
        <ErrorDialog.Popup className={styles.error}>
          <div className={styles.errorDialog}>
            <div>
              <ErrorDialog.Title className={styles.errorTitle}>
                Something went wrong.
              </ErrorDialog.Title>
              <ErrorDialog.Description className={styles.errorDescription} />
            </div>
            <div className={styles.errorActions}>
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
