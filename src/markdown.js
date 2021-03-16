import React from 'react';

import ReactMarkdown from 'react-markdown';

import Logo from './logo';


const renderers = {
  // heading: ({ children }) => <Box textStyle="h1">{children}</Box>,
  // paragraph: ({ children }) => <Box textStyle="p">{children}</Box>,
  // image: () => <Logo />
}

export default function ({ content }) {
  return <ReactMarkdown renderers={renderers}>{content}</ReactMarkdown>
}
