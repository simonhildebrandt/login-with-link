import React from 'react';

import {
  Flex,
  Box,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  HStack,
} from "@chakra-ui/react";

import Gravatar from 'gravatar';

import { logout } from './login-check';

import { navigate } from './router';

import Logo from './logo';


function SignedInHeader({ user }) {

  const { email } = user;
  const gravatarUrl = Gravatar.url(email, { size: 32 });

  return <Flex
    px={2}
    justify="space-between"
    align="center"
    bgColor="gray.600"
    height="60px"
  >
    <Box
      cursor="pointer"
      onClick={() => navigate("/")}
      bgColor="gray.50"
      px={2}
      borderRadius={8}
    >
      <Logo width={100} height={40} />
    </Box>

    <Flex align="center">
      <HStack spacing="4" pr="4">
        <Button onClick={() => navigate("/docs")} variant="link">Docs</Button>
        <Button onClick={() => navigate("/admin")} variant="link">Admin</Button>
      </HStack>

      <Menu>
        <MenuButton as={Button}>
          <Image src={gravatarUrl} />
        </MenuButton>
        <MenuList>
          <MenuGroup title={`${email}`}>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Flex>
  </Flex>
}

SignedInHeader.displayName = "SignedInHeader";

export default SignedInHeader;
