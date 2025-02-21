import * as React from 'react';

import { cn } from 'lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

const Input = ({ className, type, ref, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={cn(
        'focus-visible:outline-green hover:border-green border-grey flex h-10 w-full rounded-md border bg-black px-3 py-2 text-sm -outline-offset-1 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:outline disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-red aria-[invalid=true]:hover:border-red aria-[invalid=true]:focus-visible:outline-red',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};

export { Input };
