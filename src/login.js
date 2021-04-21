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
import Page from './page';
import Loader from './loader';
import ErrorPage from './error-page';


const getApiDataUrl = baseURL + "api/keys/";
const sendLinkUrl = baseURL + "api/send-link";

function Login({ user, apiKey }) {
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
        setApiKeyData(response.data)
      })
      .catch(error => setApiError(error));
  }, [apiKey]);

  function updateEmail(e) {
    setEmail(e.target.value);
  }

  if (apiError) return <ErrorPage message="Error loading information about this client." />;
  if (!apiKeyData) return <Loader text="Loading client..." />;

  return <Page user={user}>
    <Box
      borderWidth={1}
      borderColor="gray.200"
      borderStyle="solid"
      minWidth={500}
      borderRadius={8}
      p={8}
      w="50%"
      mx="auto"
      mt={32}
    >
      {successResponse ? (
        <>
          <h2>Login to <strong>{apiKeyData.name}</strong> successful.</h2>
          <p>Please check your email and click the link we've sent to you.</p>
        </>
      ) : (
        <>
          <h2>Log into <strong>{apiKeyData.name}</strong></h2>
          <Box my={4} color="gray.400">
            Enter your email below to log in to <strong>{apiKeyData.name}</strong>.
          </Box>
          <form>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input value={email} onChange={updateEmail} type="email" />
              <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>

            <Flex mt={2} justify="flex-end">
              <Button onClick={onSubmit}>Login</Button>
            </Flex>
          </form>
        </>
      )}
    </Box>

  </Page>
}

Login.displayName = "Login";

export default Login;
