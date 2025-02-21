import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'lib/utils';

const buttonVariants = cva(
  '!text-xs-medium border border-grey flex items-center gap-4 h-10 rounded-md text-light-grey -outline-offset-1',
  {
    variants: {
      variant: {
        default:
          'hover:border-green bg-black focus-visible:text-green hover:text-green focus-visible:outline outline-green',
        destructive:
          'hover:border-red bg-black focus-visible:text-red hover:text-red focus-visible:outline outline-red',
      },
      size: {
        default: 'px-4',
        iconRight: 'pr-4 pl-5',
        iconLeft: 'pl-4 pr-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
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
  asChild = false,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
};
Button.displayName = 'Button';

export { Button, buttonVariants };
