import React from 'react';

import {
  Box
} from "@chakra-ui/react";

import {
  formatEmailSubject, formatTextEmail, formatHtmlEmail
} from "../functions/email-template";

import { host } from './utils';


function DummyEmail({ client }) {
  const emailParams = {
    client_name: client.name,
    style: client.style,
    link: "https://login-with.link",
    host
  };

  const content = {
    subject: formatEmailSubject(emailParams),
    __text: formatTextEmail(emailParams),
    __html: formatHtmlEmail(emailParams)
  };

  return <Box borderWidth={1} borderColor="gray.200" p={2} overflow="hidden">
    <Box borderBottomWidth={1} borderColor="gray.200" pb={1}>
      <Box>From: <strong>login-with.link</strong></Box>
      <Box>Subject: <strong>{content.subject}</strong></Box>
    </Box>
    <Box pt={1} dangerouslySetInnerHTML={content} />
  </Box>
}

DummyEmail.displayName = "DummyEmail";

export default DummyEmail;
