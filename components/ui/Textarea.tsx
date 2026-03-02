import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          rows={rows}
          className={cn(
            'w-full px-4 py-2 text-right bg-white border rounded-lg transition-colors resize-vertical',
            'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent',
            'placeholder:text-gray-400',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 hover:border-gray-400',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 text-right">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
