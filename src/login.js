import React, { useState, useEffect, useCallback } from 'react';

import {
  Box, Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Spinner
} from "@chakra-ui/react"

import Axios from 'axios';

import { baseURL } from './utils';
import Page from './page';
import Loader from './loader';
import ErrorPage from './error-page';


const getApiDataUrl = baseURL + "api/keys/";
const sendLinkUrl = baseURL + "api/send-link";


function LoginBody({successResponse, apiKeyData, onSubmit, sendingRequest}) {
  const [email, setEmail] = useState("");

  function updateEmail(e) {
    setEmail(e.target.value);
  }

  if (successResponse) {
    return <>
      <h2>Login to <strong>{apiKeyData.name}</strong> successful.</h2>
      <p>Please check your email and click the link we've sent to you.</p>
    </>
  }

  return <>
    <h2>Log into <strong>{apiKeyData.name}</strong></h2>
    <Box my={4} color="gray.400">
      Enter your email below to log in to <strong>{apiKeyData.name}</strong>.
    </Box>
    { sendingRequest ? (
      <Flex mt={8} justify="center"><Spinner size="xl"/></Flex>
    ) : (
      <form>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input value={email} onChange={updateEmail} type="email" />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>

        <Flex mt={2} justify="flex-end">
          <Button onClick={() => onSubmit(email)}>Login</Button>
        </Flex>
      </form>
    )}
  </>
}


function Login({ user, apiKey }) {
  const [apiKeyData, setApiKeyData] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [successResponse, setSuccessResponse] = useState(false);
  const [apiError, setApiError] = useState(null);

  const onSubmit = useCallback((email) => {
    setSendingRequest(true);
    Axios.post(sendLinkUrl, { email, key: apiKey })
      .then(response => {
        console.log(response);
        setSendingRequest(false);
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
      <LoginBody 
        successResponse={successResponse} 
        apiKeyData={apiKeyData} 
        sendingRequest={sendingRequest} 
        onSubmit={onSubmit}
      />
    </Box>

  </Page>
}

Login.displayName = "Login";

export default Login;
