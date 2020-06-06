import api from 'dota-data/files/vscripts/api';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { getInterfacesForTypes } from '../../data';
import {
  AvailabilityBadge,
  CenteredKindIcon,
  CommonGroupHeader,
  CommonGroupSignature,
  CommonGroupWrapper,
  ElementBadges,
  ElementLink,
  OptionalDescription,
  SearchOnGitHub,
  SearchOnGoogle,
} from '../common';
import { InterfaceDeclaration } from '../InterfaceDeclaration';
import { FunctionParameter, Types } from '../types';

const FunctionWrapper = styled(CommonGroupWrapper)`
  padding: 2px 5px;
`;

const FunctionHeader = styled(CommonGroupHeader)``;
const FunctionSignature = styled(CommonGroupSignature)``;

const RelatedInterfaces = styled.div`
  margin: 0 30px;
`;

export const FunctionDeclaration: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  context?: string;
  declaration: api.FunctionDeclaration;
}> = ({ className, style, context, declaration }) => {
  const relatedInterfaces = useMemo(
    () =>
      declaration.args.flatMap(arg => {
        const interfaces = getInterfacesForTypes(arg.types);
        if (interfaces.length === 0) return [];
        return interfaces.map(x => <InterfaceDeclaration key={x.name} declaration={x} />);
      }),
    [],
  );

  const parameterDescriptions = useMemo(
    () =>
      declaration.args
        .filter(arg => arg.description)
        .map(arg => (
          <li key={arg.name}>
            {arg.name}
            {` - ${arg.description}`}
          </li>
        )),
    [],
  );

  return (
    <FunctionWrapper className={className} style={style} id={declaration.name}>
      <FunctionHeader>
        <FunctionSignature>
          <CenteredKindIcon kind="function" size="big" />
          {declaration.name}(
          {declaration.args.map((x, i) => [
            <FunctionParameter key={x.name} name={x.name} types={x.types} />,
            i === declaration.args.length - 1 ? null : ', ',
          ])}
          ):&nbsp;{<Types types={declaration.returns} />}
        </FunctionSignature>
        <ElementBadges>
          <AvailabilityBadge available={declaration.available} />
          <SearchOnGitHub name={declaration.name} />
          <SearchOnGoogle name={declaration.name} />
          {context && <ElementLink scope={context} hash={declaration.name} />}
        </ElementBadges>
      </FunctionHeader>
      {relatedInterfaces.length > 0 && <RelatedInterfaces>{relatedInterfaces}</RelatedInterfaces>}
      <OptionalDescription
        description={
          (declaration.description || parameterDescriptions.length > 0) && (
            <>
              {parameterDescriptions}
              {declaration.description}
            </>
          )
        }
      />
    </FunctionWrapper>
  );
};
