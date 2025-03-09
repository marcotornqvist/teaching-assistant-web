'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from 'lib/utils';

const Checkbox = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  ref?: React.Ref<HTMLButtonElement>;
}) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-5 w-5 rounded-sm border border-grey focus-visible:border-green focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-green data-[state=checked]:bg-green data-[state=checked]:text-white',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('text-current flex items-center justify-center')}
    >
      <Check className='h-4 w-4' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
