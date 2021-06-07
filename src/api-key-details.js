import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Button,
  ButtonGroup,
  HStack,
  Link,
  Tag,
  Spinner
} from "@chakra-ui/react"

import { ViewIcon, CopyIcon } from '@chakra-ui/icons'

import DeleteDialog from './delete-dialog';

import { useAuthedApiCall, host } from './utils';

import { DEFAULT_LOGIN_LIMIT } from '../functions/constants';


function validUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function ApiKeyDetails({ clientId, apiKey, refresh }) {
  const { name, key, returnUrl, secret, loginLimit = DEFAULT_LOGIN_LIMIT } = apiKey;

  const keyLink = `${host}/#/login/${key}`;

  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const {
    loading: updatingKey,
    start: updateKey
  } = useAuthedApiCall({
    method: "PUT",
    url: `private/clients/${clientId}/keys/${key}`,
    data: {
      name: newName,
      returnUrl: newUrl
    }
  });

  const {
    loading: loadingLogins,
    start: loadLogins,
    data: recentLogins
  } = useAuthedApiCall({
    method: "GET",
    url: `private/clients/${clientId}/keys/${key}/logins`
  });

  useEffect(() => {
    loadLogins();
  }, []);

  const {
    loading: deletingKey,
    start: deleteKey
  } = useAuthedApiCall({
    method: "DELETE",
    url: `private/clients/${clientId}/keys/${key}`
  });


  useEffect(() => {
    setNewName(name);
    setNewUrl(returnUrl);
  }, []);

  const [hidden, setHidden] = useState(true);

  function toggleHidden() { setHidden(!hidden); }

  function copySecret() {
    navigator.clipboard.writeText(secret);
  }

  function copyLink() {
    navigator.clipboard.writeText(keyLink);
  }

  function updateName(e) {
    setNewName(e.target.value);
  }

  function updateUrl(e) {
    setNewUrl(e.target.value);
  }

  function resetForm() {
    setNewName(name);
    setNewUrl(returnUrl);
  }

  function saveForm() {
    updateKey().then(refresh);
  }

  const changed = (name !== newName) || (returnUrl != newUrl);
  const nameErrored = (newName == "");
  const urlErrored = (newUrl == "") || !validUrl(newUrl);
  const errored = nameErrored || urlErrored;


  const [deleteOpen, setDeleteOpen] = useState(false);
  function askDeleteKey() { setDeleteOpen(true); }
  function closeDelete() { setDeleteOpen(false); };
  function reallyDelete() {
    setDeleteOpen(false);
    deleteKey().then(refresh);
  };

  const changingKey = updatingKey || deletingKey;

  return <Box borderColor="teal.500" borderLeftWidth={2} px={3} my={4}>
    <DeleteDialog
      noun={"API Key"}
      deleteOpen={deleteOpen}
      closeDelete={closeDelete}
      reallyDelete={reallyDelete}
    />

    <Flex flexWrap="wrap" justify="space-between">
      <Flex layerStyle="doubled">
        <FormControl id="name">
          <FormLabel>Key Name</FormLabel>
          <Input
            id={`name-${key}`}
            isInvalid={nameErrored}
            type="text" onChange={updateName}
            placeholder="production"
            value={newName}
          />
          <FormHelperText>A human-readable name for this key, like 'production'.</FormHelperText>
        </FormControl>
      </Flex>
      <Flex layerStyle="doubled">
        <FormControl id="key">
          <FormLabel>Unique Key</FormLabel>
          <Input
            id={`key-${key}`}
            disabled
            readOnly
            type="text"
            value={key}
          />
          <FormHelperText>The unique identifier for referring to this key.</FormHelperText>
        </FormControl>
      </Flex>
      <Flex layerStyle="doubled">
        <FormControl id="secret">
          <FormLabel>Secret</FormLabel>
          <InputGroup>
            <InputLeftAddon onClick={toggleHidden}><ViewIcon /></InputLeftAddon>
            <Input
              id={`secret-${key}`}
              disabled
              readOnly
              type={hidden ? "password" : "text"}
              value={secret}
            />
            {!hidden && (
              <InputRightAddon onClick={copySecret}><CopyIcon /></InputRightAddon>
            )}
          </InputGroup>
          <FormHelperText>The secret used to sign your user tokens.</FormHelperText>
        </FormControl>
      </Flex>
      <Flex layerStyle="doubled">
        <FormControl id="returnUrl">
          <FormLabel>Return URL</FormLabel>
          <Input
            id={`url-${key}`}
            isInvalid={urlErrored}
            type="text"
            onChange={updateUrl}
            value={newUrl}
          />
          <FormHelperText>The destination URL we return to, after a user logs in.</FormHelperText>
        </FormControl>
      </Flex>
    </Flex>
    <Flex>
      <HStack mt={4} flexGrow={1} flexWrap="wrap">
        <ButtonGroup>
          <Button
            colorScheme="red"
            disabled={changingKey}
            onClick={askDeleteKey}
          >Delete</Button>
          <Button
            colorScheme="red"
            disabled={!changed || changingKey}
            onClick={resetForm}
          >Reset</Button>
          <Button
            type="submit"
            isLoading={updatingKey}
            colorScheme="blue"
            disabled={!changed || errored || changingKey}
            onClick={saveForm}
          >Save</Button>
        </ButtonGroup>
        <Tag size="lg" color="gray.500"> 
          {loadingLogins ? <Spinner size="xs" mr={2}/> : recentLogins?.count } logins 
          / {loginLimit} max
        </Tag>
        <Flex fontSize={20} flexGrow={1} justify="flex-end" align="center">
          <Link href={keyLink}>{keyLink}</Link>
          <Button ml={2} variant="outline" onClick={copyLink}><CopyIcon /></Button>
        </Flex>
      </HStack>
    </Flex>
  </Box>
}

ApiKeyDetails.displayName = "ApiKeyDetails";

export default ApiKeyDetails;
