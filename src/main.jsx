import React from 'react';
import { Box, Flex, Button, Image } from "@chakra-ui/react"

import { navigate } from './router';

import Page from './page';
import Markdown from './markdown';

import content from '../content/main.md.txt';


export default function ({ user }) {
  return <Page user={user}>

    <Flex justify="center" mt={8}>
      <Box maxWidth="800px">

        <Box textAlign="center">

          <Box
            fontSize={60}
            fontWeight={700}
            lineHeight="60px"
            mb={6}
          >Secure your app<br/>in minutes!</Box>

          <Button
            colorScheme="blue"
            shadow="0 0 5px #4c8cc8"
            onClick={() => navigate(`/docs`)}
          >Add to your app</Button>

          <Box mt={3} color="gray.400" fontSize="12px">Free! No card required</Box>
        </Box>

        <Box my={10} position="relative" shadow="xl">
          <Box
            position="absolute"
            width="100%"
            height="100%"
            bgGradient="linear(to-b, transparent, white)"
          />
            <Image
              borderRadius="md"
              borderColor="gray.300"
              borderWidth="1px"
              borderStyle="solid"
              src="dashboard.png"
            />
        </Box>


        <Flex mt={16}>
          <Box><Markdown content={content} /></Box>
          <Box>{/* Coffee Link? */}</Box>
        </Flex>
      </Box>
    </Flex>

  </Page>
}
