import "@babel/polyfill";

import React, { useState, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ChakraProvider } from "@chakra-ui/react"

import { navigate, useRouter } from './router';
import Pages from './pages';
import Main from './main';
import Admin from './admin';
import Login from './login';
import Loader from './loader';

import { handleToken, loginCheck } from './login-check';

import { privateKey } from './utils';

import theme from './theme';


handleToken();


function ShowPage({ showView, user, apiKey }) {
  if (showView === 'login') return <Login user={user} apiKey={apiKey} />;
  if (showView === 'admin') return <Admin user={user} />;
  if (showView === 'main') return <Main user={user} />;
  return <Pages user={user} page={showView} />;
}

const App = () => {
  const [routerState, setRouterState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { showView: null, apiKey: null }
  )
  const { showView, apiKey } = routerState;
  const [login, setLogin] = useState({});
  const { state: loginState, user } = login;

  useRouter(router => {
    router
      .on('/admin', () => {
        setRouterState({ showView: 'admin' });
      })
      .on('/docs', () => {
        setRouterState({ showView: 'docs' });
      })
      .on('/login/:apiKey', ({ apiKey }) => {
        setRouterState({ showView: 'login', apiKey });
      })
      .on('/', () => {
        setRouterState({ showView: 'main' });
      })
      .on('/:other', ({ other }) => {
        setRouterState({ showView: other });
      })
      .resolve();
  });

  useEffect(() => {
    loginCheck({ key: privateKey }).then(result => setLogin(result));
  }, []);

  if (!loginState) return <Loader text="Checking login..." />;

  return <ShowPage showView={showView} user={user} apiKey={apiKey} />
};

ReactDOM.render(<ChakraProvider theme={theme}><App /></ChakraProvider>, document.getElementById('app'));
