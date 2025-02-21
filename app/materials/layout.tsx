import AsideMenu from 'components/elements/AsideMenu';
import Main from 'components/elements/Main';
import Header from 'components/layout/Header';
import { Button } from 'components/ui/Button';
import { Separator } from 'components/ui/Separator';
import { ArrowLeft, Trash2 } from 'lucide-react';
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
            <Button variant='destructive' size='iconLeft'>
              Delete Material
              <Trash2 strokeWidth={1.5} width={16} height={16} />
            </Button>
            {/* <button className='text-sm-medium'>Delete Material</button> */}
          </div>
        </div>
      </Header>
      <Main variant='aside'>
        <AsideMenu>Lorem</AsideMenu>
        <div className='flex w-full justify-center px-4 py-12'>
          <div className='w-full max-w-[900px] flex-1 overflow-y-scroll'>
            {children}
          </div>
        </div>
      </Main>
    </>
  );
};

export default Layout;
