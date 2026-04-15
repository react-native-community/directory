import { type ComponentProps, forwardRef } from 'react';

export const MarkdownVideoPlayerButton = forwardRef<HTMLButtonElement, ComponentProps<'button'>>(
  function Button({ className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={`media-button media-button--subtle media-button--icon ${className ?? ''}`}
        {...props}
      />
    );
  }
);
