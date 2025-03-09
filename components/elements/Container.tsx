import { cn } from 'lib/utils';
import React from 'react';

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn('w-full px-4 lg:px-6', className)}>{children}</div>;
};

export default Container;
