import React from 'react';
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  useStyleConfig
} from "@chakra-ui/react";

import { HamburgerIcon } from '@chakra-ui/icons'


const ClientMenuItem = ({client, selected, onClick, onDelete}) => {
  const styles = useStyleConfig("ClientMenuItem", { variant: selected ? 'selected' : '' })

  return <Flex sx={styles} onClick={() => onClick(client.id)} justifyContent="space-between" alignItems="center">
    {client.name}
    {selected &&
      <Menu>
        <MenuButton as={IconButton} variant="ghost" icon={<HamburgerIcon />}></MenuButton>
        <MenuList>
          <MenuItem onClick={() => onDelete(client)}>Delete</MenuItem>
        </MenuList>
      </Menu>
    }
  </Flex>
};

ClientMenuItem.displayName = 'ClientMenuItem';

export default ClientMenuItem;
