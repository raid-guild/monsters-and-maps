import { Flex } from '@chakra-ui/react';

import { Header } from './Header';
import { Footer } from './Footer';

import BackgroundImage from '../assets/home__background.png';

export const Layout = ({ children }) => {
  return (
    <Flex
      minH='100vh'
      direction='column'
      justify='space-between'
      align='center'
      overflowX='hidden'
      bgImage={`url(${BackgroundImage})`}
      bgSize='cover'
      color='red'
    >
      <Header />
      {children}
      <br />
      <Footer />
    </Flex>
  );
};
