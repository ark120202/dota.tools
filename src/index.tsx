import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { NavBar } from '~components/layout/NavBar';
import { colors } from '~utils/constants';
import { AppRoutes } from './pages';

const GlobalStyle = (() => {
  const css = createGlobalStyle;
  return css`
    html,
    body,
    #root {
      width: 100%;
      height: 100%;
      margin: 0;
    }
  `;
})();

const PageContent = styled.div`
  display: flex;
  flex: 1;
  flex-flow: row;
  height: 100%;
`;

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: ${colors.background};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  color: ${colors.text};
`;

function App() {
  return (
    <AppWrapper>
      <GlobalStyle />
      <NavBar />
      <BrowserRouter>
        <PageContent>
          <React.Suspense fallback={null}>
            <AppRoutes />
          </React.Suspense>
        </PageContent>
      </BrowserRouter>
    </AppWrapper>
  );
}

render(<App />, document.querySelector('#root'));
