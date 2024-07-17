import { type PopperContentProps } from '@radix-ui/react-popper';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { PropsWithChildren, ReactNode } from 'react';

type TooltipProps = PropsWithChildren<{
  trigger: ReactNode;
  sideOffset?: number;
  side?: PopperContentProps['side'];
}>;

function Tooltip({ children, trigger, side, sideOffset = 4 }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={0}>
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
