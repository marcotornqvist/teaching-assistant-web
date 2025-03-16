import ToggleMode from 'components/ui/ToggleMode';
import { cn } from 'lib/utils';
import Link from 'next/link';
import React, { ReactNode } from 'react';

type HeaderProps = {
  children?: ReactNode;
  variant?: 'default' | 'aside';
  className?: string;
};

const Header = ({ children, variant = 'default', className }: HeaderProps) => {
  return (
    <nav
      className={cn(
        'flex max-h-16 min-h-16 w-full items-center justify-between border-b pt-0 max-lg:px-4',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center lg:h-16 lg:min-w-75 lg:px-6',
          variant === 'aside' ? 'lg:border-r' : '',
        )}
      >
        <Link href='/' className='text-lg-bold whitespace-nowrap'>
          Study Platform
        </Link>
      </div>
      <div
        className={cn(
          'flex w-full items-center justify-end lg:justify-between',
          variant === 'aside' ? 'lg:px-6' : 'lg:pr-6',
        )}
      >
        <div className='hidden lg:flex'>{children}</div>
        <ToggleMode className='-mr-2' />
      </div>
    </nav>
  );
};

// const Links = ({ className }: { className?: string }) => (
//   <ul className={cn('-mr-2 flex gap-4', className)}>
//     <li>
//       <Link href='/' className='p-2'>
//         Dashboard
//       </Link>
//     </li>
//     <li>
//       <Link href='/modules' className='p-2'>
//         Modules
//       </Link>
//     </li>
//     <li>
//       <Link href='/materials' className='p-2'>
//         Materials
//       </Link>
//     </li>
//     <li>
//       <Link href='/tasks' className='p-2'>
//         Materials
//       </Link>
//     </li>
//   </ul>
// );

export default Header;
