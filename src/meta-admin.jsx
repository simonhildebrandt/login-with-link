import React from 'react';

import Admin from 'meta-admin-client';

import { db, auth } from './firebase';

const adminConfig = [];

export default () => {
  return <Admin
    config={adminConfig}
    firestore={db}
    firebaseAuth={auth}
    apiURL="http://127.0.0.1:5001/login-with-link/us-central1/admin"
    basename="/meta-admin"
  />;
}
