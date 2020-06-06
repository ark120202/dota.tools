import { darken } from 'polished';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { colors } from '~utils/constants';
import { useRouterSearch, useSetSearchQuery } from './search';
import SearchIcon from './search.svg';

export function useCtrlFHook<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (ref.current && event.ctrlKey && event.key === 'f') {
        // Use default CTRL+F only when element already has focus
        if (document.activeElement !== ref.current) event.preventDefault();
        ref.current.focus();
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [ref.current]);

  return ref;
}

const SearchBoxWrapper = styled.div`
  display: flex;
  flex-flow: row;
  background-color: ${colors.additional};
  border: 1px solid black;
`;

const SearchBoxInput = styled.input`
  flex: 1;
  padding: 6px 8px;
  background: none;
  border: none;
  font-size: 22px;
  outline: none;
  color: ${colors.text};

  ::placeholder {
    color: ${darken(0.2, colors.text)};
  }
`;

const SearchButton = styled.button<{ isUpdated: boolean }>`
  border: none;
  background-color: ${({ isUpdated }) => darken(isUpdated ? 0 : 0.1, colors.searchButton)};

  path {
    fill: ${({ isUpdated }) => darken(isUpdated ? 0 : 0.3, colors.text)};
  }

  > * {
    vertical-align: middle;
  }
`;

export const SearchBox: React.FC<{ className?: string }> = React.memo(({ className }) => {
  const routerSearch = useRouterSearch();
  const [search, setSearch] = useState(routerSearch);
  useEffect(() => setSearch(routerSearch), [routerSearch]);

  const updateCurrentSearch = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    ({ target: { value } }) => setSearch(value),
    [],
  );
  const handleKey = useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    event => event.key === 'Enter' && setSearchQuery(search),
    [search],
  );

  const setSearchQuery = useSetSearchQuery();
  const handleSearchButton = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    () => setSearchQuery(search),
    [search],
  );
  const handleSearchButtonMouseDown = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    e => e.preventDefault(),
    [],
  );

  const ref = useCtrlFHook<HTMLInputElement>();

  return (
    <SearchBoxWrapper className={className}>
      <SearchBoxInput
        placeholder="Search..."
        ref={ref}
        value={search}
        onChange={updateCurrentSearch}
        onKeyUp={handleKey}
      />
      <SearchButton
        isUpdated={search !== routerSearch}
        onClick={handleSearchButton}
        onMouseDown={handleSearchButtonMouseDown}
      >
        <SearchIcon width={25} height={25} />
      </SearchButton>
    </SearchBoxWrapper>
  );
});
