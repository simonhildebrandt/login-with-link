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


function ShowPage({ showView, user, apiKey, state }) {
  if (showView === 'login') return <Login user={user} apiKey={apiKey} state={state} />;
  if (showView === 'admin') return <Admin user={user} />;
  if (showView === 'main') return <Main user={user} />;
  return <Pages user={user} page={showView} />;
}

const App = () => {
  const [routerState, setRouterState] = useReducer(
    (current, newState) => ({ ...current, ...newState }),
    { showView: null, apiKey: null, state: null }
  )
  const { showView, apiKey, state } = routerState;
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
      .on('/login/:apiKey', ({ apiKey }, query) => {
        const urlParams = new URLSearchParams(query);
        const state = urlParams.get('state');
        setRouterState({ showView: 'login', apiKey, state });
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

  return <ShowPage showView={showView} user={user} apiKey={apiKey} state={state} />
};

ReactDOM.render(<ChakraProvider theme={theme}><App /></ChakraProvider>, document.getElementById('app'));
