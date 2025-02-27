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
      className={cn(
        'hidden h-[calc(100svh-4rem)] min-w-75 max-w-[300px] overflow-y-scroll border-r px-6 pt-8 lg:flex',
        className,
      )}
    >
      <div className='h-full'>{children}</div>
    </aside>
  );
};

export default AsideMenu;
