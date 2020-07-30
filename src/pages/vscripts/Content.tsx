import React from 'react';
import styled from 'styled-components';
import { LazyList, ScrollableList } from '~components/Lists';
import { SearchBox } from '~components/Search';
import { Declaration, useFilteredData } from './data';
import { ClassDeclaration } from './elements/ClassDeclaration';
import { Constant } from './elements/Constant';
import { Enum } from './elements/Enum';
import { FunctionDeclaration } from './elements/FunctionDeclaration';

export function Content() {
  const { data, isSearching } = useFilteredData();
  return (
    <ContentWrapper>
      <StyledSearchBox baseUrl="/vscripts" />

      {data.length > 0 ? (
        isSearching ? (
          <LazyList data={data} render={renderItem} />
        ) : (
          <ScrollableList data={data} render={renderItem} />
        )
      ) : isSearching ? (
        <TextMessage>No results found</TextMessage>
      ) : (
        <TextMessage>Choose a category or use the search bar...</TextMessage>
      )}
    </ContentWrapper>
  );
}

const ContentWrapper = styled.main`
  flex: 1;
  height: 100%;
  display: flex;
  flex-flow: column;
`;

const StyledSearchBox = styled(SearchBox)`
  margin: 6px;
`;

const TextMessage = styled.div`
  margin-top: 50px;
  align-self: center;
  font-size: 42px;
`;

const ListItem = styled.div`
  box-sizing: border-box;
  padding: 6px;
  :not(:last-child) {
    padding-bottom: 0;
  }
`;

function renderItem(declaration: Declaration, style?: React.CSSProperties) {
  let children: JSX.Element;
  switch (declaration.kind) {
    case 'class':
      children = <ClassDeclaration declaration={declaration} />;
      break;
    case 'enum':
      children = <Enum element={declaration} />;
      break;
    case 'constant':
      children = <Constant element={declaration} />;
      break;
    case 'function':
      children = <FunctionDeclaration context="functions" declaration={declaration} />;
      break;
  }

  return (
    <ListItem style={style} key={declaration.name}>
      {children}
    </ListItem>
  );
}
