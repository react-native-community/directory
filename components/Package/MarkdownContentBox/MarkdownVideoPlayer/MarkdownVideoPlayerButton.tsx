import { type ComponentProps } from 'react';

export function MarkdownVideoPlayerButton({ className, ref, ...props }: ComponentProps<'button'>) {
  return (
    <button
      ref={ref}
      type="button"
      className={`media-button media-button--subtle media-button--icon ${className ?? ''}`}
      {...props}
    />
  );
}
