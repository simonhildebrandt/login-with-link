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

import MetaAdmin from './meta-admin';


handleToken();


function ShowPage({ showView, user, apiKey, state, email }) {
  if (showView === 'login') return <Login user={user} apiKey={apiKey} state={state} email={email} />;
  if (showView === 'admin') return <Admin user={user} />;
  if (showView === 'main') return <Main user={user} />;
  if (showView === 'meta-admin') return <MetaAdmin/>;
  return <Pages user={user} page={showView} />;
}

const App = () => {
  const [routerState, setRouterState] = useReducer(
    (current, newState) => ({ ...current, ...newState }),
    { showView: null, apiKey: null, state: null, email: null }
  )
  const { showView, apiKey, state, email } = routerState;
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
      .on('/meta-admin/*', () => {
        setRouterState({ showView: 'meta-admin' });
      })
      .on('/login/:apiKey', ({ apiKey }, query) => {
        const urlParams = new URLSearchParams(query);
        const state = urlParams.get('state');
        const email = urlParams.get('email') || "";
        setRouterState({ showView: 'login', apiKey, state, email });
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

  return <ShowPage showView={showView} user={user} apiKey={apiKey} state={state} email={email} />
};

ReactDOM.render(<ChakraProvider theme={theme}><App /></ChakraProvider>, document.getElementById('app'));
