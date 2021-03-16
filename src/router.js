import { useEffect } from 'react';
import Navigo from 'navigo';

const router = new Navigo(null, true, '#');

function useRouter(callable) {
  useEffect(() => callable(router), []);
}

function navigate(path) {
  router.navigate(path);
}

export { useRouter, navigate }; 
