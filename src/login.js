import React, { useState, useEffect, useCallback } from 'react';

import {
  Box, Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button
} from "@chakra-ui/react"

import Axios from 'axios';

import { navigate } from './router';

import { baseURL } from './utils';


const getApiDataUrl = baseURL + "api/keys/";
const sendLinkUrl = baseURL + "api/send-link";

function Login({apiKey}) {
  const [apiKeyData, setApiKeyData] = useState(null);
  const [successResponse, setSuccessResponse] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [email, setEmail] = useState("");

  const onSubmit = useCallback(() => {
    Axios.post(sendLinkUrl, { email, key: apiKey })
    .then(response => {
      console.log(response);
      setSuccessResponse(true);
    });
  });

  useEffect(() => {
    Axios.get(getApiDataUrl + apiKey)
    .then(response => {
      setApiKeyData(response.data.apiKey)
    })
    .catch(error => setApiError(error));
  }, [apiKey]);

  function updateEmail(e) {
    setEmail(e.target.value);
  }

  if (successResponse) return "Login successful - please follow the link in your email."
  if (apiError) return "Error loading information about this client.";
  if (!apiKeyData) return "Loading client.";

  return <Box>
    <Box as="h1">Login With Link - Login</Box>
    <Box onClick={() => navigate("/")}>Home</Box>

    <form>
      <FormControl id="email">
        <FormLabel>Email address</FormLabel>
        <Input value={email} onChange={updateEmail} type="email" />
        <FormHelperText>We'll never share your email.</FormHelperText>
      </FormControl>

      <Button onClick={onSubmit}>Login</Button>
    </form>
  </Box>
}

Login.displayName = "Login";

export default Login;
