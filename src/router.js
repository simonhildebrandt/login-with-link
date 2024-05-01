import { useEffect } from 'react';
import Navigo from 'navigo';
import { config } from './utils';


const { host } = config();

const router = new Navigo('');

function useRouter(callable) {
  useEffect(() => callable(router), []);
}

function navigate(path) {
  router.navigate(path);
}

function rewriteHashURL() {
  const url = window.location.href;
  if (url.includes('#')) {
    window.location.href = url.replace(/\#\/?/, '');
  }
}

function createURL(path) {
  return `${host}/${path}`;
}


export { useRouter, navigate, rewriteHashURL, createURL };
