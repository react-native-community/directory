import { type RefObject, useEffect, useEffectEvent, useState } from 'react';
import { type TextInput, type TextInputKeyPressEvent } from 'react-native';

import isAppleDevice from '~/util/isAppleDevice';

export function isSearchShortcutPressed(
  event: TextInputKeyPressEvent & Record<'key', unknown>
): boolean {
  return (
    event.key === 'k' &&
    (!!('metaKey' in event && event.metaKey) || !!('ctrlKey' in event && event.ctrlKey))
  );
}

export function useSearchInputFocus() {
  const [isInputFocused, setInputFocused] = useState(false);

  function handleInputFocus() {
    setInputFocused(true);
  }

  function handleInputBlur() {
    setInputFocused(false);
  }

  return {
    isInputFocused,
    handleInputFocus,
    handleInputBlur,
  };
}

export function useSearchShortcut(inputRef: RefObject<TextInput | null>) {
  const isApple = isAppleDevice();

  const keyDownListener = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'k' && (isApple ? event.metaKey : event.ctrlKey)) {
      event.preventDefault();
      inputRef.current?.focus();
    }
  });

  useEffect(() => {
    if (isApple !== null) {
      document.addEventListener('keydown', keyDownListener, false);
      return () => document.removeEventListener('keydown', keyDownListener);
    }
  }, [isApple]);

  return isApple;
}
