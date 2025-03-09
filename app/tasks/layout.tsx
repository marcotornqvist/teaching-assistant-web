import Header from 'components/layout/Header';
import Main from 'components/elements/Main';
import React, { ReactNode } from 'react';
import Container from 'components/elements/Container';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <Main>
        <Container>
          <div className='mx-auto lg:max-w-[900px]'>{children}</div>
        </Container>
      </Main>
    </>
  );
};

export default Layout;
