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
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from "@chakra-ui/react"
import { AddIcon } from '@chakra-ui/icons';

import ApiKeyDetails from './api-key-details';
import { useAuthedApiCall } from './utils';
import DummyEmail from './dummy-email';
import EditableControls from './editable-controls';


function ClientDetails({ client, onClientUpdated }) {
  const { id, name } = client;

  const [editableName, setEditableName] = useState("");
  useEffect(() => {
    setEditableName(name)
  }, [name]);

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
  }), {onSuccess: onClientUpdated});

  const [showingEmail, setShowingEmail] = useState(false);
  function toggleEmail() { setShowingEmail(_ => !_) };

  const [wideEmail, setWideEmail] = useState(true);
  function toggleWideEmail() { setWideEmail(_ => !_) };

  useEffect(() => { getApiKeys() }, [id]);

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

  const minEmailWidth = wideEmail ? 600 : 200;

  return <Box>
    <Modal
      isOpen={showingEmail}
      onClose={toggleEmail}
      size={wideEmail ? "xl" : "xs"}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Example email</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DummyEmail client={client} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggleWideEmail}>
            {wideEmail ? "> Narrow <" : "< Wide >"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    <Flex
      align="center"
      justify="space-between"
    >
      <Editable
        value={editableName}
        isPreviewFocusable={false}
        submitOnBlur={false}
        onSubmit={onUpdateName}
        onChange={setEditableName}
        alignItems="center"
        display="flex"
        size="xl"
        fontWeight="700"
      >
        {(props) => (
          <>
            <EditablePreview size="xl"/>
            <EditableInput />
            <EditableControls {...props} />
          </>
        )}
      </Editable>

      {loadingKeys && <Spinner />}
      <ButtonGroup justifyContent="center" size="sm">

        <Button
          onClick={toggleEmail}
          px="20px"
          variant="outline"
          borderColor="black"
        >
          Preview Email
        </Button>
        <Button
          isLoading={addingKey}
          onClick={addKey}
          leftIcon={<AddIcon boxSize="10px"/>}
          bg="#1B73F8"
          color="white"
          px="20px"
        >
          Key
        </Button>
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
