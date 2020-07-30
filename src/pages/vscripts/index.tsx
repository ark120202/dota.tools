import React from 'react';
import { RouterHashScroll } from '~utils/scroll';
import { Content } from './Content';
import { Sidebar } from './Sidebar';

export default function VScriptsPage() {
  return (
    <>
      <RouterHashScroll />
      <Sidebar />
      <Content />
    </>
  );
}
