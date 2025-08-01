"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  showTooltip = false,
  tooltipContent,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  showTooltip?: boolean;
  tooltipContent?: (value: number) => React.ReactNode;
}) {
  const [internalValues, setInternalValues] = React.useState<number[]>(
    Array.isArray(value)
      ? value
      : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValues(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const handleValueChange = (newValue: number[]) => {
    setInternalValues(newValue);
    props.onValueChange?.(newValue);
  };

  const [showTooltipState, setShowTooltipState] = React.useState(false);

  const handlePointerDown = () => {
    if (showTooltip) {
      setShowTooltipState(true);
    }
  };

  const handlePointerUp = React.useCallback(() => {
    if (showTooltip) {
      setShowTooltipState(false);
    }
  }, [showTooltip]);

  React.useEffect(() => {
    if (showTooltip) {
      document.addEventListener("pointerup", handlePointerUp);
      return () => {
        document.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [showTooltip, handlePointerUp]);

  const renderThumb = (value: number) => {
    const thumb = (
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        className="block size-4 shrink-0 rounded-full bg-background shadow-sm outline-none ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50"
        onPointerDown={handlePointerDown}
      />
    );

    if (!showTooltip) return thumb;

    return (
      <TooltipProvider>
        <Tooltip open={showTooltipState}>
          <TooltipTrigger asChild>{thumb}</TooltipTrigger>
          <TooltipContent
            className="px-2 py-1 text-xs"
            sideOffset={8}
            side={props.orientation === "vertical" ? "right" : "top"}
          >
            <p>{tooltipContent ? tooltipContent(value) : value}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[disabled]:opacity-50',
        className,
      )}
      onValueChange={handleValueChange}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1.5',
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
          )}
        />
      </SliderPrimitive.Track>
      {internalValues.map((value, index) => (
        <React.Fragment key={index}>{renderThumb(value)}</React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
