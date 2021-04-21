import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Button } from "@chakra-ui/react"

import { navigate } from './router';
import { logout } from './login-check';

import { privateKey } from './utils';

import Logo from './logo';

import Page from './page';
import Markdown from './markdown';

import content from '../content/main.md';


export default function ({ user }) {
  return <Page user={user}>

    <Flex justify="center" mt={8}>
      <Box maxWidth="800px">
        <Flex justify="center"><Logo /></Flex>

        {user ? (
          <Box
            my={8}
            p={4}
            border="1px"
            borderColor="gray.200"
            borderRadius="8px"
          >
            <h2>Welcome back!</h2>
            <p>
              Logged in users can click 'Admin' above to manage their
              authentication credentials, or 'Docs', to learn more
              about how <b>Login With Link</b> works.
            </p>
          </Box>
        ) : (
          <Box mx="auto" width="xl">
            <Button
              width="xl"
              padding={8}
              onClick={() => navigate(`/login/${privateKey}`)}
              my={8}
              color="white"
              bg="green.500"
              fontSize="24px"
            >Login Now!</Button>
          </Box>
        )}

        <Flex>
          <Box><Markdown content={content} /></Box>
          <Box>{/* Coffee Link? */}</Box>
        </Flex>
      </Box>
    </Flex>

  </Page>
}
