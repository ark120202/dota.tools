import { darken } from 'polished';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { IconKind, KindIcon } from '~components/KindIcon';
import { colors } from '~utils/constants';
import { topLevelData } from './data';

const SidebarLink = styled(NavLink)`
  padding: 2px;
  border: 1px solid black;
  background-color: ${colors.mainLight};
  text-decoration: none;
  color: ${colors.text};

  :not(:last-child) {
    margin-bottom: 3px;
  }

  &:hover {
    background-color: ${darken(0.09, colors.mainLight)};
  }

  &.active {
    background-color: ${darken(0.16, colors.mainLight)};
  }
`;

const SidebarElement: React.FC<{
  to: string;
  icon: IconKind;
  text: string;
}> = React.memo(({ to, icon, text }) => (
  <SidebarLink to={`/vscripts/${to}`}>
    <KindIcon kind={icon} size="small" /> {text}
  </SidebarLink>
));

const SidebarWrapper = styled.div`
  width: 20%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  overflow-y: scroll;
  padding: 4px 6px;
`;

export const Sidebar = React.memo(() => (
  <SidebarWrapper>
    <SidebarElement to="functions" icon="function" text="Functions" />
    <SidebarElement to="constants" icon="constant" text="Constants" />
    {topLevelData
      .filter(x => x.kind === 'class' || x.kind === 'enum')
      .map(({ name, kind }) => (
        <SidebarElement key={name} to={name} icon={kind} text={name} />
      ))}
  </SidebarWrapper>
));
