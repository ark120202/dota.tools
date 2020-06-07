import styled from 'styled-components';
import { KindIcon as UnstyledKindIcon } from '~components/KindIcon';

export * from './badges';
export * from './styles';

export const KindIcon = styled(UnstyledKindIcon)`
  margin-bottom: -4px;
  margin-right: 4px;
`;
