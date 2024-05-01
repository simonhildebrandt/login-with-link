import { useReducer } from 'react';

import Axios from 'axios';
import { getToken } from './login-check';


export const privateKey = "6870e340-2465-4da8-96fa-26c3027dc7e3";

export function config () {
  const environment = ENV || 'development';

  const environments = {
    development: {
      baseURL: "http://localhost:5001/login-with-link/us-central1/",
      host:    "http://127.0.0.1:9000/"
    },
    staging: {
      baseURL: "https://staging.login-with.link/",
      host:    "https://staging.login-with.link"
    },
    production: {
      baseURL: "https://login-with.link/",
      host:    "https://login-with.link/"
    }
  }

  return environments[environment];
}


export const noop = () => {};

function authedApiCall(request, params) {
  const data = params ? request(params) : request;
  const { baseURL } = config();

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
