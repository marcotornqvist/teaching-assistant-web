import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'lib/utils';

const buttonVariants = cva(
  '!text-xs-medium border whitespace-nowrap border-grey flex items-center gap-4 h-10 rounded-md text-light-grey -outline-offset-1 ',
  {
    variants: {
      variant: {
        default:
          'hover:enabled:border-green bg-black focus-visible:enabled:text-green hover:enabled:text-green focus-visible:outline outline-green',
        destructive:
          'hover:border-red bg-black focus-visible:text-red hover:text-red focus-visible:outline outline-red',
      },
      size: {
        default: 'px-4',
        iconRight: 'pr-4 pl-5',
        iconLeft: 'pl-4 pr-5',
      },
      loading: {
        true: 'opacity-100',
        false: 'disabled:opacity-50',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      loading: false,
    },
    compoundVariants: [
      {
        loading: true,
        variant: 'default',
        className: 'border-green text-green',
      },
    ],
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  loading,
  asChild = false,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, loading, className }))}
      ref={ref}
      {...props}
    />
  );
};
Button.displayName = 'Button';

export { Button, buttonVariants };
