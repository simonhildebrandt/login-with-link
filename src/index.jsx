import "@babel/polyfill";

import React, { useReducer, useContext } from 'react';
import ReactDOM from 'react-dom';

import { ChakraProvider } from "@chakra-ui/react"

import { useRouter, rewriteHashURL } from './router';
import Pages from './pages';
import Main from './main';
import Admin from './admin';
import Login from './login';
import Loader from './loader';

import { handleToken } from './login-check';

import { UserContext, UserProvider } from './user-context';

import theme from './theme';


handleToken();
rewriteHashURL();


function ShowPage({ showView, user, apiKey, state, email }) {
  if (showView === 'login') return <Login user={user} apiKey={apiKey} state={state} email={email} />;
  if (showView === 'admin') return <Admin user={user} />;
  if (showView === 'main') return <Main user={user} />;
  return <Pages user={user} page={showView} />;
}

const App = () => {
  const [routerState, setRouterState] = useReducer(
    (current, newState) => ({ ...current, ...newState }),
    { showView: null, apiKey: null, state: null, email: null }
  )
  const { showView, apiKey, state, email } = routerState;

  const { login } = useContext(UserContext);
  const { state: loginState, user } = login;

  useRouter(router => {
    router
      .on('admin', () => {
        setRouterState({ showView: 'admin' });
      })
      .on('docs', () => {
        setRouterState({ showView: 'docs' });
      })
      .on('login', () => {
        setRouterState({ showView: 'main' });
      })
      .on('login/:apiKey', ({ apiKey }, query) => {
        const urlParams = new URLSearchParams(query);
        const state = urlParams.get('state');
        const email = urlParams.get('email') || "";
        setRouterState({ showView: 'login', apiKey, state, email });
      })
      .on(() => {
        setRouterState({ showView: 'main' });
      })
      .on(':other', ({ other }) => {
        setRouterState({ showView: other });
      })
      .resolve();
  });

  if (!loginState) return <Loader text="Checking login..." />;

  return <ShowPage showView={showView} user={user} apiKey={apiKey} state={state} email={email} />
};

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <UserProvider>
      <App />
    </UserProvider>
  </ChakraProvider>,
  document.getElementById('app')
);
