import React from 'react';
import DashboardCard, { DashboardCardProps } from './DashboardCard';
import { cn } from 'lib/utils';

type DashboardCardsProps = {
  cards: DashboardCardProps[];
  type: 'materials' | 'tasks';
  className?: string;
};

const DashboardCards = ({ cards, type, className }: DashboardCardsProps) => {
  return (
    <div className={cn('', className)}>
      <h2 className='mb-2 px-4 font-medium'>
        {type === 'materials' ? 'Materials' : 'Tasks'}
      </h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {cards.map((item, i) => (
          <DashboardCard
            key={i}
            {...item}
            className={cn(type === 'materials' ? 'bg-blue' : 'bg-red')}
          />
        ))}
        <DashboardCard
          link={type === 'materials' ? '/materials/create' : '/tasks/create'}
          title={type === 'materials' ? 'Create Material' : 'Create Task'}
          className='bg-green'
        />
      </div>
    </div>
  );
};

export default DashboardCards;
