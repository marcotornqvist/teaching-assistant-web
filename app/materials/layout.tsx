import AsideMenu from 'components/elements/AsideMenu';
import Main from 'components/elements/Main';
import Header from 'components/layout/Header';
import { Separator } from 'components/ui/Separator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header variant='aside'>
        <div className='flex items-center gap-8'>
          <Link href='/' className='flex items-center gap-4'>
            <ArrowLeft width={20} height={20} />
            <span className='text-sm-medium'>Go to Dashboard</span>
          </Link>
          <Separator orientation='vertical' className='h-10' />
          <div>
            <button className='text-sm-medium'>Delete Material</button>
          </div>
        </div>
      </Header>
      <Main variant='aside'>
        <AsideMenu>Lorem</AsideMenu>
        <div className='w-full px-4'>{children}</div>
      </Main>
    </>
  );
};

export default Layout;
