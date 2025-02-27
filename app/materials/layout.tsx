import AsideMenu from 'components/elements/AsideMenu';
import Main from 'components/elements/Main';
import Header from 'components/layout/Header';
import { Button } from 'components/ui/Button';
import { Separator } from 'components/ui/Separator';
import { cn } from 'lib/utils';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';

const HeaderToolbar = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'flex min-h-16 w-full items-center gap-8 overflow-x-auto',
        className,
      )}
    >
      <Link href='/' className='flex items-center gap-4'>
        <ArrowLeft width={20} height={20} />
        <span className='text-sm-medium whitespace-nowrap'>
          Go to Dashboard
        </span>
      </Link>
      <Separator orientation='vertical' className='h-10' />
      <Button variant='destructive' size='iconRight'>
        Delete Material
        <Trash2 strokeWidth={1.5} width={16} height={16} />
      </Button>
      <Button variant='destructive' size='iconRight'>
        Delete Material
        <Trash2 strokeWidth={1.5} width={16} height={16} />
      </Button>
    </div>
  );
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex max-h-screen flex-col overflow-hidden'>
      <Header variant='aside'>
        <HeaderToolbar className='max-lg:hidden' />
      </Header>
      <Main variant='aside'>
        <AsideMenu>
          <ul className='h-full'>
            <li>Lorem</li>
            {[...Array(4)].map((_, index) => (
              <li key={index}>Lorem</li>
            ))}
            <div className='pb-12' />
          </ul>
        </AsideMenu>
        <section className='flex h-[calc(100svh-4rem)] w-full overflow-y-scroll'>
          <div className='w-full flex-1 lg:flex lg:justify-center'>
            <HeaderToolbar className='border-b border-grey pl-4 pr-5 lg:hidden' />
            <div className='w-full px-4 pt-12 lg:max-w-[900px] lg:px-6'>
              {children}
            </div>
          </div>
        </section>
      </Main>
    </div>
  );
};

export default Layout;
