import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

interface TooltipProps {
  id: string;
  content: string | React.ReactNode;
}

export default function Tooltip({ id, content, ...props }: TooltipProps) {
  return (
    <ReactTooltip
      data-tooltip-id={id}
      data-tooltip-content={content}
      {...props}
    />
  );
}
