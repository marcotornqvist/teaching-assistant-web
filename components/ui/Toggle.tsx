'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from 'lib/utils';

const toggleVariants = cva(
  'h-10 px-3 inline-flex items-center justify-center rounded-md data-[state=on]:bg-accent data-[state=on]:text-accent-foreground transition-colors data-[state=on]:text-green',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Toggle = ({
  className,
  variant,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    ref?: React.Ref<HTMLButtonElement>;
  }) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, className }))}
    {...props}
  />
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
