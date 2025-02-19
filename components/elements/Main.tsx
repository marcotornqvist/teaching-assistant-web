import { cn } from 'lib/utils';
import React from 'react';

const Main = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <main className={cn('flex-1 py-20', className)}>{children}</main>;
};

export default Main;
