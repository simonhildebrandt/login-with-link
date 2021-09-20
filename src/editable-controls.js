import React from 'react';

import { ButtonGroup, Flex, IconButton } from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'


function EditableControls({ isEditing, onSubmit, onCancel, onEdit }) {
  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm" ml={2}>
      <IconButton variant="ghost" icon={<CheckIcon />} onClick={onSubmit} />
      <IconButton variant="ghost" icon={<CloseIcon />} onClick={onCancel} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center" ml={2}>
      <IconButton
        variant="ghost"
        size="sm"
        icon={<EditIcon />}
        onClick={onEdit}
        color="brand.600"
      />
    </Flex>
  )
}

EditableControls.displayName = "EditableControls";

export default EditableControls;
