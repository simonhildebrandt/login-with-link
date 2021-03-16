import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Spinner,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  ButtonGroup
} from "@chakra-ui/react"
import { AddIcon, DeleteIcon, CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'

import ApiKeyDetails from './api-key-details';
import { useAuthedApiCall } from './utils';


function ClientDetails({ client, deleteClient }) {
  const { id, name } = client;

  const {
    loading: loadingKeys,
    finished: finishedGettingKeys,
    data: apiKeys,
    start: getApiKeys
  } = useAuthedApiCall({
    url: `private/clients/${id}/keys`
  });

  const {
    loading: addingKey,
    start: addKeyToClient
  } = useAuthedApiCall({
    method: "POST", url: `private/clients/${id}/keys`
  });

  const {
    loading: updatingName,
    start: updateName
  } = useAuthedApiCall(options => ({
    method: "PUT",
    url: `private/clients/${id}`,
    data: options
  }));

  useEffect(() => { getApiKeys() }, []);

  if (!finishedGettingKeys) return "loading";

  function refresh() {
    getApiKeys();
  }

  function addKey() {
    addKeyToClient().then(getApiKeys);
  }

  function onUpdateName(name) {
    updateName({ name });
  }

  function EditableControls({ isEditing, onSubmit, onCancel, onEdit }) {
    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm" ml={2}>
        <IconButton icon={<CheckIcon />} onClick={onSubmit} />
        <IconButton icon={<CloseIcon />} onClick={onCancel} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center" ml={2}>
        <IconButton
          size="sm"
          icon={<EditIcon />}
          onClick={onEdit}
        />
      </Flex>
    )
  }

  return <Box bgColor="white" p={2}>
    <Flex
      align="center"
      justify="space-between"
      borderColor="gray.200"
      borderBottomWidth={1}
    >
      <Editable
        defaultValue={name}
        isPreviewFocusable={false}
        submitOnBlur={false}
        onSubmit={onUpdateName}
        alignItems="center"
        display="flex"
        size="xl"
        my={2}
      >
        {(props) => (
          <>
            <EditablePreview size="xl" />
            <EditableInput />
            <EditableControls {...props} />
          </>
        )}
      </Editable>

      {loadingKeys && <Spinner />}
      <ButtonGroup justifyContent="center" size="sm">

        <Button
          isLoading={addingKey}
          onClick={addKey}
          leftIcon={<AddIcon />}
          colorScheme="blue"
        >
          Key
        </Button>
        <IconButton
          isLoading={addingKey}
          onClick={deleteClient}
          icon={<DeleteIcon />}
          colorScheme="red"
        />
      </ButtonGroup>
    </Flex>

    <Box mt={3}>
      {apiKeys.map(apiKey => <Box key={apiKey.id}>
        <ApiKeyDetails clientId={id} apiKey={apiKey} refresh={refresh} />
      </Box>)}
    </Box>
  </Box>
}

ClientDetails.displayName = "ClientDetails";

export default ClientDetails;
