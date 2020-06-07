import { Availability } from 'dota-data/files/vscripts/api';
import { darken, lighten } from 'polished';
import React, { useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { colors } from '~utils/constants';
import { doSearch } from '../../search';
import SearchGitHubIcon from './search-github.svg';
import SearchGoogleIcon from './search-google.svg';

export const ElementBadges = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  > * {
    margin-left: 5px;
  }
`;

const AvailabilityBadgeBox = styled.div<{ color: string; active: boolean }>`
  box-sizing: border-box;
  font-size: 16px;
  line-height: 1;
  width: 20px;
  height: 20px;
  text-align: center;
  user-select: none;
  background: radial-gradient(${props => props.color}, ${props => darken(0.22, props.color)});

  ${props =>
    !props.active &&
    css`
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);
      filter: saturate(10%);
    `}
`;

export const AvailabilityBadge: React.FC<{ available: Availability }> = ({ available }) => {
  const onServer = available === 'server' || available === 'both';
  const onClient = available === 'client' || available === 'both';
  return (
    <>
      <AvailabilityBadgeBox
        color="#5b82ee"
        active={onServer}
        title={`${onServer ? 'Available' : 'Unavailable'} on server-side Lua`}
      >
        s
      </AvailabilityBadgeBox>
      <AvailabilityBadgeBox
        color="#59df37"
        active={onClient}
        title={`${onClient ? 'Available' : 'Unavailable'} on client-side Lua`}
      >
        c
      </AvailabilityBadgeBox>
    </>
  );
};

const SearchWrapper = styled.a.attrs({ target: '_blank', rel: 'noreferrer noopener' })`
  display: block;
  border-radius: 3px;
  border: 1px solid ${lighten(0.3, 'black')};
  background-color: ${darken(0.1, 'white')};
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
  line-height: 1;
  padding-left: 3px;
  padding-top: 3px;
  padding-right: 1px;
  padding-bottom: 1px;
`;

export const SearchOnGitHub: React.FC<{ name: string }> = ({ name }) => {
  const query = encodeURIComponent(`path:vscripts ${name}`);
  const href = `https://github.com/search?l=Lua&q=${query}&type=Code`;
  return (
    <SearchWrapper href={href} title="Search on GitHub">
      <SearchGitHubIcon width={22} height={22} />
    </SearchWrapper>
  );
};

export const SearchOnGoogle: React.FC<{ name: string }> = ({ name }) => {
  const query = encodeURIComponent(`site:github.com inurl:vscripts "${name}"`);
  const href = `https://www.google.com/search?q=${query}`;
  return (
    <SearchWrapper href={href} title="Search on Google">
      <SearchGoogleIcon width={22} height={22} />
    </SearchWrapper>
  );
};

const StyledReferencesLink = styled(NavLink)`
  margin-right: 4px;
  color: ${colors.text};
  font-size: 18px;
  &.active {
    text-decoration: none;
    color: ${darken(0.1, colors.text)};
    cursor: default;
  }
`;

export const ReferencesLink: React.FC<{ name: string }> = ({ name }) => {
  const search = `?search=${encodeURIComponent(`type:${name}`)}`;
  const referencesCount = useMemo(() => {
    const references = doSearch([`type:${name.toLowerCase()}`]);
    return references.reduce(
      (n, e) => n + (e.kind === 'class' ? e.members.length + (e.extend === name ? 1 : 0) : 1),
      0,
    );
  }, [name]);

  return (
    <StyledReferencesLink
      to={`/vscripts${search}`}
      isActive={(_, location) => location.pathname === '/vscripts' && location.search === search}
      title="Find all usages of this API"
    >
      {referencesCount} reference{referencesCount === 1 ? '' : 's'}
    </StyledReferencesLink>
  );
};

const StyledElementLink = styled(Link)`
  margin-right: 2px;
  font-size: 30px;
  line-height: 1;
  text-decoration: none;
  color: ${colors.text};
  user-select: none;
  font-family: Arial, Helvetica, sans-serif;
`;

export const ElementLink: React.FC<{ scope: string; hash?: string }> = ({ scope, hash }) => {
  const urlHash = hash ? `#${hash}` : '';
  return (
    <StyledElementLink to={`/vscripts/${scope}${urlHash}`} title="Link">
      #
    </StyledElementLink>
  );
};

export function useLinkedElement({ scope, hash }: { scope?: string; hash?: string }) {
  const urlHash = hash ? `#${hash}` : '';
  const location = useLocation();
  return (
    scope !== undefined && location.pathname === `/vscripts/${scope}` && location.hash === urlHash
  );
}
