import { cn } from 'lib/utils';
import React, { ReactNode } from 'react';

const AsideMenu = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <aside
      className={cn('min-w-75 hidden border-r px-6 py-8 lg:flex', className)}
    >
      {children}
    </aside>
  );
};

export default AsideMenu;
