import React from 'react';

import Page from './page';

import about from '../content/about.md';
import docs from '../content/docs.md';

import Markdown from './markdown';


const pages = { about, docs };

export default function ({ user, page }) {
  const content = pages[page] || `No page '${page}' found.`

  return <Page user={user}>
    <Markdown content={content} />
  </Page>
}
