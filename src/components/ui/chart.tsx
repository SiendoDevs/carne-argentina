'use client';

import * as React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ReactNode;
}

export function ChartContainer({
  config,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div {...props}>
      <style>
        {Object.entries(config).map(([key, value]) => {
          return `
            [data-chart-color='${key}'] {
              color: ${value.color};
              --color-${key}: ${value.color};
            }
          `;
        })}
      </style>
      {children}
    </div>
  );
}

interface ChartTooltipProps extends React.ComponentProps<typeof Tooltip> {
  content: React.ReactNode;
  trigger: React.ReactNode;
}

export function ChartTooltip({
  content,
  trigger,
  ...props
}: ChartTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface ChartTooltipContentProps {
  payload?: Array<{ value: number; name: string }>;
  active?: boolean;
  label?: string;
  hideLabel?: boolean;
}

export function ChartTooltipContent({
  payload,
  active,
  label,
  hideLabel = false,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="space-y-1">
      {!hideLabel && <p className="text-sm font-medium">{label}</p>}
      {payload.map((item, index) => (
        <p key={index} className="text-sm text-muted-foreground">
          {item.name}: {item.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}