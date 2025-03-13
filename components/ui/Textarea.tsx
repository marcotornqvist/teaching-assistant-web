import { cn } from 'lib/utils';
import React from 'react';

const Textarea = ({
  className,
  ref,
  ...props
}: React.ComponentProps<'textarea'> & {
  className?: string;
}) => {
  return (
    <textarea
      className={cn(
        'text-sm w-full resize-none overflow-hidden bg-black leading-[150%] text-white outline-none lg:text-base placeholder:text-grey focus-visible:border-none',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};
Textarea.displayName = 'Textarea';

export { Textarea };
