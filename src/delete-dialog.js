import React, { useRef } from 'react';

import { 
  Box, 
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from "@chakra-ui/react"


function DeleteDialog({noun, deleteOpen, closeDelete, reallyDelete}) {
  const cancelDeleteRef = React.useRef()

  return <AlertDialog
    isOpen={deleteOpen}
    leastDestructiveRef={cancelDeleteRef}
    onClose={closeDelete}
  >
    <AlertDialogOverlay>
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Delete {noun}
        </AlertDialogHeader>

        <AlertDialogBody>
          Are you sure? You can't undo this action afterwards.
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={cancelDeleteRef} onClick={closeDelete}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={reallyDelete} ml={3}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogOverlay>
  </AlertDialog>
}

DeleteDialog.displayName = "DeleteDialog";

export default DeleteDialog;

