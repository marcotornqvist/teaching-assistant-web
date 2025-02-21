'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from 'lib/utils';

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md data-[state=on]:bg-accent data-[state=on]:text-accent-foreground transition-colors data-[state=on]:text-green',
  {
    variants: {
      variant: {
        default: '',
      },
      size: {
        default: 'h-10 px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Toggle = ({
  className,
  variant,
  size,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    ref?: React.Ref<HTMLButtonElement>;
  }) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
