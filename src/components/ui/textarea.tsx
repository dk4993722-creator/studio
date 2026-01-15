
import * as React from 'react';

import {cn} from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    const { register } = useFormContext() || {}; // react-hook-form
    
    // If ref is provided, use it. Otherwise, if register is available and a name is passed, use register.
    const textareaRef = ref || (register && props.name ? register(props.name).ref : null);

    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={textareaRef}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
