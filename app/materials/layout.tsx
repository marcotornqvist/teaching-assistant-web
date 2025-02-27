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
    </div>
  );
};

type LinkType = { text: string; link: string };

const List = ({
  title,
  items,
  className,
}: {
  title: string;
  items: LinkType[];
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {title ? <h3 className='text-base-bold'>{title}</h3> : null}
      <ol className='flex h-full list-decimal flex-col gap-4 pl-4'>
        {items.map((item, index) => (
          <li className='text-sm-medium' key={index}>
            <Link href={item.link}>{item.text}</Link>
          </li>
        ))}
        <div className='pb-12' />
      </ol>
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
          <List
            title='Modules'
            items={[
              {
                text: 'The Ancient Pyramids of Egypt loremasdfioasdfjoasf',
                link: '/materials/1',
              },
              { text: 'The Ancient Pyramids of Egypt', link: '/materials/2' },
              { text: 'The Ancient Pyramids of Egypt', link: '/materials/3' },
              {
                text: 'The Ancient Pyramids of Egypt loremasdfioasdfjoasf',
                link: '/materials/1',
              },
              { text: 'The Ancient Pyramids of Egypt', link: '/materials/2' },
              { text: 'The Ancient Pyramids of Egypt', link: '/materials/3' },
            ]}
          />
          <List
            title='Module Materials'
            items={[
              { text: 'The Ancient Pyramids of Egypt', link: '/materials/1' },
              { text: 'The Ancient Pyramids of Egypt', link: '/materials/2' },
              { text: 'The Ancient Pyramids of Egypt', link: '/materials/3' },
            ]}
          />
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
