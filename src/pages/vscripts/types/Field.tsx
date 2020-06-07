import api from 'dota-data/files/vscripts/api';
import React from 'react';
import styled from 'styled-components';
import {
  CommonGroupHeader,
  CommonGroupSignature,
  CommonGroupWrapper,
  ElementBadges,
  ElementLink,
  KindIcon,
  useLinkedElement,
} from './common';
import { Types } from './types';

const FieldWrapper = styled(CommonGroupWrapper)`
  padding: 4px;
`;
const FieldHeader = styled(CommonGroupHeader)``;
const FieldSignature = styled(CommonGroupSignature)`
  font-size: 20px;
`;

export const Field: React.FC<{
  className?: string;
  context?: string;
  element: api.Field;
}> = ({ className, context, element }) => {
  const isLinked = useLinkedElement({ scope: context, hash: element.name });
  return (
    <FieldWrapper className={className} id={element.name} isLinked={isLinked}>
      <FieldHeader>
        <FieldSignature>
          <KindIcon kind="field" size="big" />
          {element.name}
          {element.types.includes('nil') && '?'}:{' '}
          {<Types types={element.types.filter(x => x !== 'nil')} />}
        </FieldSignature>
        <ElementBadges>
          {context && <ElementLink scope={context} hash={element.name} />}
        </ElementBadges>
      </FieldHeader>
    </FieldWrapper>
  );
};
