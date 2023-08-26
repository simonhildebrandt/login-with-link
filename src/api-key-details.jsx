import React, { useState, useEffect } from 'react';
import {
  Box,
  Checkbox,
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
  SimpleGrid,
  Spinner,
  Tooltip,
  Editable,
  EditableInput,
  EditablePreview,
  Progress,
} from "@chakra-ui/react"

import { ViewIcon, CopyIcon } from '@chakra-ui/icons'

import DeleteDialog from './delete-dialog';

import { useAuthedApiCall, host } from './utils';

import { DEFAULT_LOGIN_LIMIT } from '../functions/constants';

import EditableControls from './editable-controls';


function validUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function ApiKeyDetails({ clientId, apiKey, refresh }) {
  const { name, key, returnUrl, secret, exchange = false, loginLimit = DEFAULT_LOGIN_LIMIT } = apiKey;

  const keyLink = `${host}/#/login/${key}`;

  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newExchange, setNewExchange] = useState(false);

  const {
    loading: updatingKey,
    start: updateKey
  } = useAuthedApiCall({
    method: "PUT",
    url: `private/clients/${clientId}/keys/${key}`,
    data: {
      name: newName,
      returnUrl: newUrl,
      exchange: newExchange
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
    setNewExchange(exchange);
  }, []);

  const [hidden, setHidden] = useState(true);

  function toggleHidden() { setHidden(!hidden); }

  function copySecret() {
    navigator.clipboard.writeText(secret);
  }

  function copyLink() {
    navigator.clipboard.writeText(keyLink);
  }

  function updateUrl(e) {
    setNewUrl(e.target.value);
  }

  function updateExchange(e) {
    setNewExchange(e.target.checked);
  }

  function resetName() {
    setNewName(name);
  }

  function resetForm() {
    setNewName(name);
    setNewUrl(returnUrl);
    setNewExchange(exchange);
  }

  function saveForm() {
    updateKey().then(refresh);
  }

  const changed = (name !== newName) || (returnUrl != newUrl) || (exchange != newExchange);
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

  return <Box bg="white" p={4} pt={1} mb={4} borderRadius={8}>
    <DeleteDialog
      noun={"API Key"}
      deleteOpen={deleteOpen}
      closeDelete={closeDelete}
      reallyDelete={reallyDelete}
    />

    <Flex direction="row" justify="space-between" alignItems="flex-start" mb={6}>
      <Flex direction="column">
          <Editable
            value={newName}
            isPreviewFocusable={false}
            submitOnBlur={false}
            onChange={setNewName}
            onCancel={resetName}
            alignItems="center"
            display="flex"
            size="sm"
            fontWeight="700"
          >
            {(props) => (
              <>
                <EditablePreview size="sm"/>
                <EditableInput />
                <EditableControls {...props} />
              </>
            )}
          </Editable>

        <Flex fontSize={12} flexGrow={1} align="center" onClick={copyLink} color="gray.500">
          <Link href={keyLink}>{keyLink}</Link>
        </Flex>
      </Flex>

      <Tooltip label="Recent logins, and your current maximum - for 24 hour window">
        <Box color="gray.500" mt={3} bg="gray.50" borderRadius={8} overflow="hidden" fontSize="14px">
          <Box mx={8} my={2}>
            {loadingLogins ? <Spinner size="xs" mr={2}/> : recentLogins?.count }/{loginLimit} logins
          </Box>
          <Progress value={(recentLogins?.count / loginLimit) * 100}/>
        </Box>
      </Tooltip>
    </Flex>

    <SimpleGrid spacing={4} columns={{xl: 3, lg: 2, md: 1}}>
      <Box>
        <FormControl id="key">
          <FormLabel>Unique Key</FormLabel>
          <Input
            id={`key-${key}`}
            disabled
            readOnly
            type="text"
            value={key}
            size="sm"
          />
          <FormHelperText>The unique identifier for referring to this key.</FormHelperText>
        </FormControl>
      </Box>
      <Box>
        <FormControl id="secret">
          <FormLabel>Secret</FormLabel>
          <InputGroup size="sm">
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
      </Box>
      <Box>
        <FormControl id="returnUrl">
          <FormLabel>Return URL</FormLabel>
          <Input
            id={`url-${key}`}
            isInvalid={urlErrored}
            type="text"
            onChange={updateUrl}
            value={newUrl}
            size="sm"
          />
          <FormHelperText>The destination URL we return to, after a user logs in.</FormHelperText>
        </FormControl>
      </Box>
      <Box>
        <FormControl id="exchange">
          <FormLabel>Code exchange?</FormLabel>
          <Checkbox
            id={`exchange-${key}`}
            onChange={updateExchange}
            isChecked={newExchange}
          />
          <FormHelperText>Use the more complex (but more secure) code exchange process.</FormHelperText>
        </FormControl>
      </Box>
    </SimpleGrid>
    <Flex mt={4}>
      <HStack mt={4} flexGrow={1} flexWrap="wrap" justifyContent="flex-end">
        <ButtonGroup>
          <Button
            colorScheme="red"
            variant="outline"
            disabled={changingKey}
            onClick={askDeleteKey}
          >Delete</Button>
          <Button
            colorScheme="red"
            variant="outline"
            disabled={!changed || changingKey}
            onClick={resetForm}
          >Reset</Button>
          <Button
            isLoading={updatingKey}
            colorScheme="blue"
            disabled={!changed || errored || changingKey}
            onClick={saveForm}
          >Save</Button>
        </ButtonGroup>
      </HStack>
    </Flex>
  </Box>
}

ApiKeyDetails.displayName = "ApiKeyDetails";

export default ApiKeyDetails;
