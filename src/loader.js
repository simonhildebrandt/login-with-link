import React from 'react';

import {
  Flex,
  CircularProgress
} from "@chakra-ui/react"


function Loader({ text }) {

  return <Flex
    direction="column"
    align="center"
    justify="center"
    height="100%"
  >
    <CircularProgress isIndeterminate size={120} color="gray.200" thickness={4} />
    <Flex>{text}</Flex>
  </Flex>
}

Loader.displayName = "Loader";

export default Loader;
