import React from 'react';
import { cn } from '@/lib/utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({
  className,
  children,
  required = false,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        'block text-sm font-medium text-gray-700 mb-1 text-right',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
  );
}
