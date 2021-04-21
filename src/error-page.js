import React from 'react';

import { Flex, Button } from "@chakra-ui/react";

import { navigate } from './router';


function ErrorPage({ message }) {
  return <Flex justify="center" bg="red.500" color="white" p={4} fontWeight="bold">
    {message}
    <Button ml={2} onClick={() => navigate("/")} variant="link" color="black">Home ➜</Button>
  </Flex>
}

ErrorPage.displayName = "ErrorPage";

export default ErrorPage;
