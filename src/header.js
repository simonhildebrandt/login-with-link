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



function UserTools({ user }) {
  const { email } = user;
  const gravatarUrl = Gravatar.url(email, { size: 32 });

  return <Menu>
    <MenuButton as={Button}>
      <Image src={gravatarUrl} />
    </MenuButton>
    <MenuList>
      <MenuGroup title={`${email}`}>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuGroup>
    </MenuList>
  </Menu>
}

function Header({ user }) {
  return <Flex
    px={3}
    py={2}
    justify="space-between"
    align="center"
    bgColor="gray.600"
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
        {user && <Button onClick={() => navigate("/admin")} variant="link">Admin</Button>}
      </HStack>

      {user && <UserTools user={user} />}
    </Flex>
  </Flex>
}

Header.displayName = "Header";

export default Header;
