import Container from 'components/elements/Container';
import ToggleMode from 'components/ui/ToggleMode';
import { cn } from 'lib/utils';
import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <nav className='flex min-h-16 items-center border-b lg:min-h-20'>
      <div className='flex w-full items-center justify-between px-4 pt-0 lg:px-6'>
        <Link href='/' className='-ml-2 p-2 font-bold dark:text-white'>
          Assistant AI
        </Link>
        <ToggleMode className='-mr-2' />
        {/* <Links className='max-lg:hidden' /> */}
      </div>
    </nav>
  );
};

const Links = ({ className }: { className?: string }) => (
  <ul className={cn('-mr-2 flex gap-4', className)}>
    <li>
      <Link href='/' className='p-2'>
        Dashboard
      </Link>
    </li>
    <li>
      <Link href='/modules' className='p-2'>
        Modules
      </Link>
    </li>
    <li>
      <Link href='/materials' className='p-2'>
        Materials
      </Link>
    </li>
    <li>
      <Link href='/tasks' className='p-2'>
        Materials
      </Link>
    </li>
  </ul>
);

export default Header;
