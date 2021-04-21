import React from 'react';
import { Box, Flex, Button, HStack } from "@chakra-ui/react"

import { navigate } from './router';
import Header from './header';


const Footer = ({ children }) => {
  return <Box bg="lightgray" px={4} py={2}>{children}</Box>
}

export default function ({ user, children }) {
  return <Flex direction="column" height="100%">
    <Header user={user} />

    <Box
      px={4}
      py={2}
      flexGrow={1}
      flexShrink={1}
      overflowY="auto"
      width="100%"
    >
      <Box m="auto" maxWidth="800px" pb={16}>{children}</Box>
    </Box>
    <Footer>
      <HStack spacing={4}>
        <Button onClick={() => navigate("/about")} variant="link">Privacy</Button>
        <Button onClick={() => navigate("/about")} variant="link">About</Button>
      </HStack>
    </Footer>
  </Flex >
}
