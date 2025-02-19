import Container from 'components/elements/Container';
import Main from 'components/elements/Main';
import { DashboardCardProps } from 'components/misc/dashboard-cards/DashboardCard';
import DashboardCards from 'components/misc/dashboard-cards/DashboardCards';
import React from 'react';

const materialsData: DashboardCardProps[] = [
  {
    link: '/materials/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/materials/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/materials/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/materials/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/materials/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/materials/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/materials/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
];

const tasksData: DashboardCardProps[] = [
  {
    link: '/tasks/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/tasks/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/tasks/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/tasks/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/tasks/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/tasks/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: '/tasks/the-ancient-pyramids-of-egypt',
    title: 'The Ancient Pyramids of Egypt',
  },
];

const Page = () => {
  return (
    <Main className='flex justify-center'>
      <Container className='max-w-screen-2xl'>
        <DashboardCards
          type='materials'
          cards={materialsData}
          className='mb-20'
        />
        <DashboardCards type='tasks' cards={tasksData} />
      </Container>
    </Main>
  );
};

export default Page;
