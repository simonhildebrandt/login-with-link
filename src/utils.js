import { useReducer } from 'react';

import Axios from 'axios';
import { getToken } from './login-check';

const environment = ENV || 'development';

const environments = {
  development: {
    baseURL: "http://localhost:5001/login-with-link/us-central1/",
    host:    "http://localhost:9000"
  },
  staging: {
    baseURL: "https://us-central1-login-with-link-staging.cloudfunctions.net/",
    host:    "https://login-with-link-staging.web.app/"
  },
  production: {
    baseURL: "https://login-with.link/",
    host:    "https://login-with.link/"
  }
}


export const { baseURL, host } = environments[environment];

export const privateKey = "6870e340-2465-4da8-96fa-26c3027dc7e3";


export const noop = () => {};


function authedApiCall(request, params) {
  const data = params ? request(params) : request;

  const { headers = {} } = data;
  const Authorization = getToken();
  return Axios.request({ ...data, baseURL, headers: { ...headers, Authorization } })
}

export function useAuthedApiCall(request, { onSuccess = noop } = {}) {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { loading: false, finished: false, data: null }
  )

  function start(params) {
    setState({ loading: true });
    return authedApiCall(request, params)
      .then(res => {
        setState({ data: res.data, loading: false, finished: true });
      })
      .then(onSuccess);
  };

  return { ...state, start };
}
