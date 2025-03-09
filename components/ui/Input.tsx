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
        'file:bg-transparent placeholder:text-muted-foreground text-sm flex h-10 w-full rounded-md border border-grey bg-black px-3 py-2 -outline-offset-1 file:text-sm file:border-0 file:font-medium hover:border-green focus-visible:outline-none focus-visible:outline focus-visible:outline-green disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-red aria-[invalid=true]:hover:border-red aria-[invalid=true]:focus-visible:outline-red',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};

export { Input };
