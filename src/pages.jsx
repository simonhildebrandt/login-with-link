import React from 'react';

import Page from './page';

import about from '../content/about.md.txt';
import docs from '../content/docs.md.txt';

import Markdown from './markdown';


const pages = { about, docs };

export default function ({ user, page }) {
  const content = pages[page] || `No page '${page}' found.`

  return <Page user={user}>
    <Markdown content={content} />
  </Page>
}
