import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { PropsWithChildren, ReactNode } from 'react';

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
            <TooltipPrimitive.Arrow style={{ fill: '#000' }} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export default Tooltip;
