import Axios from 'axios';
import { config } from './utils';
import { navigate } from './router';

const { baseURL } = config();;

const storageKey = "lwlToken";
const tokenCheckUrl = baseURL + "api/check";

export async function loginCheck({ key: apiKey }) {
  return new Promise(async resolve => {
    const token = getToken();
    if (!token) return resolve({ state: "loggedOut" });

    return Axios.get(
      tokenCheckUrl,
      { params: { token, apiKey } }
    ).then(({data}) => {
      resolve({ state: "loggedIn", user: data.user })
    })
      .catch(() => resolve({ state: "loggedOut", error: true }));
  });
}

export function handleToken() {
  const url = new URL(window.location);
  const params = url.searchParams;
  const token = params.get("lwl-token");
  if (token) {
    localStorage.setItem(storageKey, token);
    params.delete("lwl-token");
    window.location.href = url;
  }
}

export function logout(setLogin) {
  localStorage.removeItem(storageKey);
  setLogin({ state: "loggedOut" });
}

export function getToken() {
  return localStorage.getItem(storageKey);
}
