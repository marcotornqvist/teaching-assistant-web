import React from 'react';
import { cn } from 'lib/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export type DashboardCardProps = {
  link: string;
  title: string;
  className?: string;
};

const DashboardCard = ({ link, title, className }: DashboardCardProps) => {
  return (
    <Link
      href={link}
      className={cn(
        'flex aspect-[12/9] w-full items-end rounded-md p-4',
        className,
      )}
    >
      <div className='flex w-full items-end justify-between'>
        <h3 className='text-sm-medium pr-5 text-black'>{title}</h3>
        <ArrowRight
          strokeWidth={2}
          width={20}
          height={20}
          className='min-h-5 min-w-5 stroke-black'
        />
      </div>
    </Link>
  );
};

export default DashboardCard;
