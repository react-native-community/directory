import { type ReactNode, useEffect, useRef, useState } from 'react';
import { type NativePointerEvent, type NativeSyntheticEvent, View } from 'react-native';

import { useLayout } from '~/common/styleguide';
import { cx } from '~/util/tailwind';

const FILE_TREE_WIDTH_STORAGE_KEY = '@ReactNativeDirectory:CodeBrowser:fileTreeWidth';
const DEFAULT_FILE_TREE_WIDTH = 340;
const MIN_FILE_TREE_WIDTH = 260;
const MAX_FILE_TREE_WIDTH = 480;

type Props = {
  header?: ReactNode;
  sidebar: ReactNode;
  sidebarFooter?: ReactNode;
  content: ReactNode;
  hasActiveContent?: boolean;
  isBrowserMaximized: boolean;
};

export default function CodeBrowserLayout({
  header,
  sidebar,
  sidebarFooter,
  content,
  hasActiveContent = false,
  isBrowserMaximized,
}: Props) {
  const { isSmallScreen } = useLayout();
  const fileTreeResizeStartRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const [fileTreeWidth, setFileTreeWidth] = useState(() =>
    getStoredFileTreeWidth(FILE_TREE_WIDTH_STORAGE_KEY)
  );
  const [isFileTreeResizing, setFileTreeResizing] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(FILE_TREE_WIDTH_STORAGE_KEY, String(fileTreeWidth));
  }, [fileTreeWidth]);

  useEffect(() => {
    if (!isFileTreeResizing) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      const start = fileTreeResizeStartRef.current;

      if (!start) {
        return;
      }

      setFileTreeWidth(clampFileTreeWidth(start.startWidth + (event.clientX - start.startX)));
    }

    function endResizing() {
      fileTreeResizeStartRef.current = null;
      setFileTreeResizing(false);
    }

    function clampWidthToViewport() {
      setFileTreeWidth(currentWidth => clampFileTreeWidth(currentWidth));
    }

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', endResizing);
    document.addEventListener('pointercancel', endResizing);
    window.addEventListener('resize', clampWidthToViewport);

    return () => {
      document.body.style.cursor = 'auto';
      document.body.style.userSelect = 'auto';
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', endResizing);
      document.removeEventListener('pointercancel', endResizing);
      window.removeEventListener('resize', clampWidthToViewport);
    };
  }, [isFileTreeResizing]);

  function startFileTreeResize(event: NativeSyntheticEvent<NativePointerEvent>) {
    event.preventDefault();

    fileTreeResizeStartRef.current = {
      startX: event.nativeEvent.clientX,
      startWidth: fileTreeWidth,
    };

    setFileTreeResizing(true);
  }

  return (
    <View
      id="codeBrowser"
      className={cx(
        'mt-2 flex gap-1 overflow-hidden rounded-xl border border-palette-gray2 bg-default text-black dark:border-border dark:bg-dark dark:text-white',
        cx(
          isBrowserMaximized
            ? 'fixed inset-0 mt-0 flex-1 rounded-none border-0'
            : cx(isSmallScreen ? 'h-[82.5vh]' : 'h-[70vh]')
        )
      )}>
      {isBrowserMaximized && header}
      <View
        className={cx(
          'flex flex-row',
          cx(
            isBrowserMaximized ? 'flex-1 border-l-0' : cx(isSmallScreen ? 'h-[82.5vh]' : 'h-[70vh]')
          ),
          cx(isBrowserMaximized && !!header && 'border border-palette-gray2 dark:border-border'),
          cx(isSmallScreen && 'flex-col')
        )}>
        {sidebar != null && (
          <View
            className={cx(
              'relative z-10 flex flex-shrink-0',
              cx(!isSmallScreen && 'h-full'),
              cx(isSmallScreen && 'w-full')
            )}
            style={[!isSmallScreen && { width: fileTreeWidth }]}>
            <View className={cx('flex-1', cx(isFileTreeResizing && 'pointer-events-none'))}>
              {sidebar}
            </View>
            {!isSmallScreen && (
              <View
                accessibilityRole="adjustable"
                onPointerDown={startFileTreeResize}
                className={cx(
                  'absolute -right-0.5 top-0 z-10 h-full w-1 opacity-40',
                  cx(isFileTreeResizing && 'bg-palette-gray3 dark:bg-palette-gray5'),
                  'cursor-col-resize'
                )}
              />
            )}
            {sidebarFooter}
          </View>
        )}
        <View
          className={cx(
            'flex flex-1',
            cx(hasActiveContent && 'bg-white dark:bg-[#0d1117]'),
            cx(isSmallScreen && 'min-h-0')
          )}>
          {content}
        </View>
      </View>
    </View>
  );
}

function getStoredFileTreeWidth(storageKey: string) {
  if (typeof window === 'undefined') {
    return DEFAULT_FILE_TREE_WIDTH;
  }

  const storedWidth = Number(window.localStorage.getItem(storageKey));

  if (!Number.isFinite(storedWidth)) {
    return DEFAULT_FILE_TREE_WIDTH;
  }

  return clampFileTreeWidth(storedWidth);
}

function clampFileTreeWidth(width: number) {
  if (typeof window === 'undefined') {
    return Math.max(MIN_FILE_TREE_WIDTH, width);
  }

  const maxWidth = Math.max(MIN_FILE_TREE_WIDTH, MAX_FILE_TREE_WIDTH);

  return Math.min(Math.max(width, MIN_FILE_TREE_WIDTH), maxWidth);
}
