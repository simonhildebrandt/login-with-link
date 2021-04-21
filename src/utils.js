import { useState, useCallback, useReducer, useEffect } from 'react';

import Axios from 'axios';
import { getToken } from './login-check';

export const baseURL = process.env.API_URL || "http://localhost:5001/login-with-link/us-central1/";

export const privateKey = "6870e340-2465-4da8-96fa-26c3027dc7e3";

export const host = "https://login-with.link";

function authedApiCall(request, params) {
  const data = params ? request(params) : request;

  const { headers = {} } = data;
  const Authorization = getToken();
  return Axios.request({ ...data, baseURL, headers: { ...headers, Authorization } })
}

export function useAuthedApiCall(request) {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { loading: false, finished: false, data: null }
  )

  function start(params) {
    setState({ loading: true });
    return authedApiCall(request, params)
      .then(res => {
        setState({ data: res.data, loading: false, finished: true });
      });
  };

  return { ...state, start };
}
