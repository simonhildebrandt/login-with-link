import React, { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Spinner,
  Link
} from "@chakra-ui/react"

import Axios from 'axios';

import { baseURL } from './utils';
import Page from './page';
import Loader from './loader';
import ErrorPage from './error-page';


const getApiDataUrl = baseURL + "api/keys/";
const sendLinkUrl = baseURL + "api/send-link";


function LoginBody({successResponse, apiKeyData, onSubmit, sendingRequest, emailValue}) {
  const [email, setEmail] = useState(emailValue);
  const {name, style} = apiKeyData;

  function updateEmail(e) {
    setEmail(e.target.value);
  }

  if (successResponse) {
    return <>
      <h2>Login to <strong>{name}</strong> successful.</h2>
      <p>Please check your email and click the link we've sent to you.</p>
    </>
  }

  return <>
    { style === 'faslet' ? (
      <>
        <img src="faslet-logo.png"/>
        <Box my={4} p={2} style={{backgroundColor: "#4faf93"}} color="white">
          Enter your email below to log in to <strong>{name}</strong>.
        </Box>
      </>
    ) : (
      <>
        <h2>Log into <strong>{name}</strong></h2>
        <Box my={4} color="gray.400">
          Enter your email below to log in to <strong>{apiKeyData.name}</strong>.
        </Box>
      </>
    ) }
    { sendingRequest ? (
      <Flex mt={8} justify="center"><Spinner size="xl"/></Flex>
    ) : (
      <form onSubmit={() => onSubmit(email)}>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input value={email} onChange={updateEmail} type="email" />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>

        <Flex mt={2} justify="flex-end">
          <Button type="submit">Login</Button>
        </Flex>
      </form>
    )}
  </>
}


function Login({ apiKey, state, email="" }) {
  const [apiKeyData, setApiKeyData] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [successResponse, setSuccessResponse] = useState(false);
  const [apiError, setApiError] = useState(null);

  const onSubmit = useCallback((email) => {
    setSendingRequest(true);
    Axios.post(sendLinkUrl, { email, key: apiKey, state })
      .then(_ => {
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

  return <Box
      minWidth={500}
      mx="auto"
      w="50%"
      pt={32}
    >
    <Box
      borderWidth={1}
      borderColor="gray.200"
      borderStyle="solid"
      borderRadius={8}
      p={8}
    >
      <LoginBody
        successResponse={successResponse}
        apiKeyData={apiKeyData}
        sendingRequest={sendingRequest}
        onSubmit={onSubmit}
        emailValue={email}
      />

    </Box>
    <Box mt={2} textAlign="right" color="gray.300" fontSize="sm">
      Authentication provided by <Link href="https://login-with.link">Login With Link</Link>
    </Box>
  </Box>
}

Login.displayName = "Login";

export default Login;
