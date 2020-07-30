import api from 'dota-data/files/vscripts/api';
import React from 'react';
import styled from 'styled-components';
import { Field } from './Field';
import { KindIcon } from './utils/components';
import { CommonGroupMembers, CommonGroupWrapper } from './utils/styles';

const InterfaceHeader = styled.div`
  padding: 4px;
`;

const InterfaceName = styled.span`
  font-size: 18px;
  font-weight: 700;
`;

const InterfaceDescription = styled.div`
  font-size: 18px;
  margin: 5px 20px;
`;

const InterfaceMembers = styled(CommonGroupMembers)`
  > :not(:last-child) {
  }
`;

export const InterfaceDeclaration: React.FC<{
  className?: string;
  declaration: api.InterfaceDeclaration;
}> = ({ className, declaration }) => (
  <CommonGroupWrapper className={className}>
    <InterfaceHeader>
      <KindIcon kind="interface" size="small" />
      <InterfaceName>{declaration.name}</InterfaceName>
    </InterfaceHeader>
    {declaration.description && (
      <InterfaceDescription>{declaration.description}</InterfaceDescription>
    )}
    {declaration.members.length > 0 && (
      <InterfaceMembers>
        {declaration.members.map(member => (
          <Field key={member.name} element={member} />
        ))}
      </InterfaceMembers>
    )}
  </CommonGroupWrapper>
);
