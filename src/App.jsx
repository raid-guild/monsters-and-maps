import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppContextProvider from './context/AppContext';

import { theme } from './theme/index';
import { Layout } from './shared/Layout';

import Main from './pages/main';
import World from './pages/world'
import DashBoard from './pages/dashboard';
import Map from './pages/map';
import Monster from './pages/monster';

import { ErrorBoundary } from './components/ErrorBoundary';

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary>
        <AppContextProvider>
          <Router>
            <Layout>
              <Switch>
                <Route path='/' exact component={Main}></Route>
                <Route path='/world' exact component={World}></Route>
                <Route path='/dashboard' exact component={DashBoard}></Route>
                <Route path='/map/:tokenId' exact component={Map}></Route>
                <Route
                  path='/monster/:tokenId'
                  exact
                  component={Monster}
                ></Route>
              </Switch>
            </Layout>
          </Router>
        </AppContextProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;
