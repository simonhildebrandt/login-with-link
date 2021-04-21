import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Button, Spinner } from "@chakra-ui/react"

import { authedApiCall, useAuthedApiCall } from './utils';

import ClientDetails from './client-details';

import DeleteDialog from './delete-dialog';

import Header from './header';

import { navigate } from './router';
import Loader from './loader';


export default function ({ user }) {
  if (!user) navigate("/");

  const {
    loading: gettingClients,
    finished: gotClients,
    start: getClients,
    data: clients,
  } = useAuthedApiCall({
    url: `private/clients`
  });

  useEffect(() => { getClients() }, []);

  const {
    loading: addingClient,
    start: addClient
  } = useAuthedApiCall({
    method: "POST",
    url: `private/clients`
  });

  const {
    loading: deletingClient,
    start: deleteClient
  } = useAuthedApiCall(options => ({
    method: "DELETE",
    url: `private/clients/${options.id}`
  }));

  function addNewClient() {
    addClient()
      .then(getClients)
  }

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletableClient, setDeletableClient] = useState(null);
  function askDeleteClient(client) {
    setDeleteOpen(true);
    setDeletableClient(client);
  }
  function closeDelete() { setDeleteOpen(false); };
  function reallyDelete() {
    deleteClient(deletableClient).then(getClients);
    setDeleteOpen(false);
  };

  const updating = gettingClients || deletingClient;

  if (!gotClients) return <Loader text="Loading admin..." />;

  return <Flex direction="column" bgColor="gray.100" height="100%" overflow="hidden">

    <Header user={user} />

    <Box height="100%" overflow="hidden">
      {clients.length == 0 ? (
        <Box>
          <Box>Click below to get started:</Box>
          <Button
            isLoading={addingClient}
            onClick={addNewClient}
            colorScheme="green"
          >Create A New Client</Button>
        </Box>
      ) : (
        <Flex direction="column" height="100%" overflow="hidden">
          <DeleteDialog
            noun={"Client"}
            deleteOpen={deleteOpen}
            closeDelete={closeDelete}
            reallyDelete={reallyDelete}
          />

          <Flex alignItems="center" p={2}>
            <Box flexGrow={1} as="h2" textStyle="h2" color="gray.600">
              Admin &gt; Clients {updating && <Spinner />}
            </Box>
            {clients.length > 0 && (
              <Button
                isLoading={addingClient}
                onClick={addNewClient}
                colorScheme="green"
              >Add New Client</Button>
            )}
          </Flex>

          <Flex direction="column" p={2} overflow="auto">
            {clients.map(client => (
              <Box key={client.id}>
                <ClientDetails
                  client={client}
                  deleteClient={() => askDeleteClient(client)}
                />
              </Box>
            ))}
          </Flex>
        </Flex>
      )}
    </Box>
  </Flex>
}
