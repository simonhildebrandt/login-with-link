import React, { useContext } from 'react';

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
  HStack
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { logout } from './login-check';

import { navigate } from './router';

import { UserContext } from './user-context';

import Logo from './logo';


function UserTools({ user }) {
  const { email } = user;

  const { setLogin } = useContext(UserContext);

  return <Menu>
    <MenuButton color="blue.600" fontWeight="bold">{email} <ChevronDownIcon /></MenuButton>
    <MenuList>
      <MenuItem onClick={() => logout(setLogin)}>Logout</MenuItem>
    </MenuList>
  </Menu>
}

function Header({ user }) {
  return <Flex
    px={3}
    py={2}
    justify="space-between"
    align="center"
    bgColor="white"
  >
    <Box
      cursor="pointer"
      onClick={() => navigate("/")}
      bgColor="gray.10"
      px={2}
      borderRadius={8}
    >
      <Logo width={100} height={40} />
    </Box>

    <Flex ml={10} align="center" grow={1} justify="space-between">
      <HStack spacing="4" pr="4" grow={1}>
        <Button onClick={() => navigate("/docs")} variant="link">Documentation</Button>
        {/* <Button onClick={() => navigate("/docs")} variant="link">Pricing</Button> */}
        {user && <Button onClick={() => navigate("/admin")} variant="link">Admin</Button>}
      </HStack>

      {
        user ? (
          <UserTools user={user}/>
        ) : (<Button
            colorScheme="blue"
            shadow="0 0 5px #4c8cc8"
            onClick={() => navigate("/login/6870e340-2465-4da8-96fa-26c3027dc7e3")}
          >Login/Register</Button>
        )}
    </Flex>
  </Flex>
}

Header.displayName = "Header";

export default Header;
