import Axios from 'axios';
import { baseURL } from './utils';

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

export function logout() {
  localStorage.removeItem(storageKey);
  window.location.reload();
}

export function getToken() {
  return localStorage.getItem(storageKey);
}
