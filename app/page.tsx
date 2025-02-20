import Container from 'components/elements/Container';
import Main from 'components/elements/Main';
import Header from 'components/layout/Header';
import { DashboardCardProps } from 'components/misc/dashboard-cards/DashboardCard';
import DashboardCards from 'components/misc/dashboard-cards/DashboardCards';
import {
  createMaterialsPageLink,
  createTasksPageLink,
} from 'lib/navigation/links';
import React from 'react';

// TODO: Convert the materials and tasks part of the link to a static link in a separate links file.

const materialsData: DashboardCardProps[] = [
  {
    link: `/${createMaterialsPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `/${createMaterialsPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `/${createMaterialsPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `/${createMaterialsPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `/${createMaterialsPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `/${createMaterialsPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `/${createMaterialsPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
];

const tasksData: DashboardCardProps[] = [
  {
    link: `${createTasksPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `${createTasksPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `${createTasksPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `${createTasksPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `${createTasksPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `${createTasksPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
  {
    link: `${createTasksPageLink}/the-ancient-pyramids-of-egypt`,
    title: 'The Ancient Pyramids of Egypt',
  },
];

const Page = () => {
  return (
    <>
      <Header />
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
    </>
  );
};

export default Page;
