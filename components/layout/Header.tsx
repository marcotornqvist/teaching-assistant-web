import Container from 'components/elements/Container';
import { link } from 'fs';
import { cn } from 'lib/utils';
import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <nav className='lg:min-h-18 flex min-h-16 items-center border-b bg-slate-50'>
      <Container className='flex items-center justify-between pt-0'>
        <Link href='/' className='font-bold'>
          Assistant AI
        </Link>
        {/* <Links className='max-lg:hidden' /> */}
      </Container>
    </nav>
  );
};

const Links = ({ className }: { className?: string }) => (
  <ul className={cn('-mr-2 flex gap-4', className)}>
    <li>
      <Link href='/dashboard' className='p-2'>
        Dashboard
      </Link>
    </li>
    <li>
      <Link href='/create-task' className='p-2'>
        Create Task
      </Link>
    </li>
    <li>
      <Link href='/sign-up' className='p-2'>
        Sign Up
      </Link>
    </li>
  </ul>
);

export default Header;
