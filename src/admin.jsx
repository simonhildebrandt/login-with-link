import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, Spinner } from "@chakra-ui/react"
import { AddIcon } from '@chakra-ui/icons'

import { useAuthedApiCall } from './utils';

import ClientDetails from './client-details';

import DeleteDialog from './delete-dialog';

import Header from './header';

import { navigate } from './router';
import Loader from './loader';
import ClientMenuItem from './client-menu-item';


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

  const [selectedClientId, selectClientId] = useState(null);
  const selectedClient = clients && clients.find(client => client.id === selectedClientId)

  useEffect(() => { getClients() }, []);
  useEffect(() => {
    if (gotClients && clients && clients.length > 0 && !selectedClient) {
      selectClientId(clients[0].id);
    }
  }, [clients, gotClients]);

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

    <Box height="100%" overflow="hidden" px="72px" pt="59px">
      {clients.length == 0 ? (
        <Flex justify="center" direction="column" align="center">
          <Flex mt={16} mb={8} as="h2" textStyle="h2">Click below to get started!</Flex>
          <Button
            size="lg"
            isLoading={addingClient}
            onClick={addNewClient}
            colorScheme="green"
          >Create A New Client</Button>
        </Flex>
      ) : (
        <Flex direction="row" height="100%" overflow="hidden">
          <DeleteDialog
            noun={"Client"}
            deleteOpen={deleteOpen}
            closeDelete={closeDelete}
            reallyDelete={reallyDelete}
          />

          <Flex direction="column" borderRightWidth="1px" borderRightColor="#E2E8F0" pr="30px" mr="30px">
            <Box fontSize="20px" fontWeight="bold" color="black" pr={8}>
              Clients {updating && <Spinner />}
            </Box>

            <Box mt={4} mb={8}>
              {clients.map(client => (
                <ClientMenuItem
                  selected={client.id == selectedClientId}
                  client={client}
                  onClick={selectClientId}
                  key={client.id}
                  onDelete={askDeleteClient}
                />
              ))}
            </Box>

            <Button
                isLoading={addingClient}
                onClick={addNewClient}
                colorScheme="brand"
                variant="outline"
                leftIcon={<AddIcon boxSize="10px"/>}
              >Add New Client</Button>
          </Flex>

          { selectedClient &&
            <Flex direction="column" p={2} overflow="auto">
              <ClientDetails client={selectedClient} onClientUpdated={getClients} />
            </Flex>
          }
        </Flex>
      )}
    </Box>
  </Flex>
}
