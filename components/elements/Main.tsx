import { cn } from 'lib/utils';
import React from 'react';

const Main = ({
  className,
  variant,
  children,
}: {
  className?: string;
  variant?: 'default' | 'aside';
  children: React.ReactNode;
}) => {
  return (
    <main
      className={cn(
        'flex flex-1',
        variant === 'aside' ? 'flex-col lg:flex-row' : 'py-12',
        className,
      )}
    >
      {children}
    </main>
  );
};

export default Main;
