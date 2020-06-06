import React from 'react';
import { APIList } from './_vscripts/APIList';
import { NavigationSidebar } from './_vscripts/NavigationSidebar';
import { RouterHashScroll } from '../utils/scroll';

export default function VScriptsPage() {
  return (
    <>
      <RouterHashScroll />
      <NavigationSidebar />
      <APIList />
    </>
  );
}
