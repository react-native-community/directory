import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type PropsWithChildren, type ReactNode, type TransitionEvent, useState } from 'react';

type TooltipProps = PropsWithChildren<{
  trigger: ReactNode;
  sideOffset?: TooltipPrimitive.TooltipContentProps['sideOffset'];
  side?: TooltipPrimitive.TooltipContentProps['side'];
  delayDuration?: TooltipPrimitive.TooltipProps['delayDuration'];
  /** Open the tooltip and keep it open, even when the trigger is pressed, until it's unset. */
  forceOpen?: boolean;
}>;

export function Tooltip({
  children,
  trigger,
  side,
  delayDuration = 0,
  sideOffset = 4,
  forceOpen = false,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [wasForceOpen, setWasForceOpen] = useState(forceOpen);
  const isClosing = isExiting && !forceOpen;

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setIsExiting(false);
      setOpen(true);
      return;
    }
    setIsExiting(true);
  }

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (!isClosing || event.target !== event.currentTarget || event.propertyName !== 'opacity') {
      return;
    }
    setIsExiting(false);
    setOpen(false);
  }

  // Open or close the tooltip when `forceOpen` changes
  if (forceOpen !== wasForceOpen) {
    setWasForceOpen(forceOpen);
    handleOpenChange(forceOpen);
  }

  return (
    <TooltipPrimitive.Root
      delayDuration={delayDuration}
      open={open}
      onOpenChange={handleOpenChange}>
      <TooltipPrimitive.Trigger asChild>{trigger}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className={`TooltipContent${isClosing ? ' TooltipContent--closing' : ''}`}
          sideOffset={sideOffset}
          side={side}
          onTransitionEnd={handleTransitionEnd}>
          {children}
          <TooltipPrimitive.Arrow asChild>
            <svg width="10" height="5" viewBox="0 0 30 10" preserveAspectRatio="none">
              <polygon points="0,0 30,0 15,10" />
              <path d="M0,0 L15,10" fill="none" />
              <path d="M30,0 L15,10" fill="none" />
            </svg>
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
