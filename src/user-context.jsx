import React, { createContext, useState, useEffect } from 'react';

import { loginCheck } from './login-check';
import { privateKey } from './utils';

export const UserContext = createContext({});

export function UserProvider({children}) {
  const [login, setLogin] = useState({});

  useEffect(() => {
    loginCheck({ key: privateKey }).then(result => setLogin(result));
  }, []);

  return <UserContext.Provider value={{login, setLogin}}>{children}</UserContext.Provider>
}
