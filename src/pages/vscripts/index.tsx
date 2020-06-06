import React from 'react';
import { RouterHashScroll } from '~utils/scroll';
import { APIList } from './APIList';
import { NavigationSidebar } from './NavigationSidebar';

export default function VScriptsPage() {
  return (
    <>
      <RouterHashScroll />
      <NavigationSidebar />
      <APIList />
    </>
  );
}
