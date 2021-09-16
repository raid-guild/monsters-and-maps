import { useState, useEffect } from 'react';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppContextProvider from './context/AppContext';

import { theme } from './theme/index';
import { Layout } from './shared/Layout';

import Main from './pages/main';
import World from './pages/world';
import DashBoard from './pages/dashboard';
import Map from './pages/map';
import Monster from './pages/monster';
import FAQ from './components/Faq';

import { ErrorBoundary } from './components/ErrorBoundary';

const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return windowWidth < 850 ? (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      bg="black"
      color="#ff3864"
      fontSize="2rem"
      p="2rem"
      textAlign="center"
    >
      Monster Maps is good on a big screen!
    </Flex>
  ) : (
    <ChakraProvider theme={theme}>
      <ErrorBoundary>
        <AppContextProvider>
          <Router>
            <Layout>
              <Switch>
                <Route path="/" exact component={Main}></Route>
                <Route path="/world" exact component={World}></Route>
                <Route path="/dashboard" exact component={DashBoard}></Route>
                <Route path="/map/:tokenId" exact component={Map}></Route>
                <Route
                  path="/monster/:tokenId"
                  exact
                  component={Monster}
                ></Route>
              </Switch>
            </Layout>
          </Router>
          <FAQ />
        </AppContextProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;
