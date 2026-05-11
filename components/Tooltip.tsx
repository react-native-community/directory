import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type PropsWithChildren, type ReactNode } from 'react';

type TooltipProps = PropsWithChildren<{
  trigger: ReactNode;
  sideOffset?: TooltipPrimitive.TooltipContentProps['sideOffset'];
  side?: TooltipPrimitive.TooltipContentProps['side'];
  delayDuration?: TooltipPrimitive.TooltipProps['delayDuration'];
}>;

function Tooltip({ children, trigger, side, delayDuration = 0, sideOffset = 4 }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={delayDuration}>
        <TooltipPrimitive.Trigger asChild>{trigger}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content className="TooltipContent" sideOffset={sideOffset} side={side}>
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
    </TooltipPrimitive.Provider>
  );
}

export default Tooltip;
