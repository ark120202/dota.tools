import api from 'dota-data/files/vscripts/api';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { getInterfacesForFunction } from '../data';
import { InterfaceDeclaration } from './InterfaceDeclaration';
import {
  AvailabilityBadge,
  ElementLink,
  KindIcon,
  SearchOnGitHub,
  SearchOnGoogle,
  useLinkedElement,
} from './utils/components';
import {
  CommonGroupHeader,
  CommonGroupSignature,
  CommonGroupWrapper,
  ElementBadges,
  OptionalDescription,
} from './utils/styles';
import { FunctionParameter, Types } from './utils/types';

const FunctionWrapper = styled(CommonGroupWrapper)`
  padding: 2px 5px;
`;

const FunctionSignature = styled(CommonGroupSignature)`
  margin-bottom: 3px;
`;

const RelatedInterfaces = styled.div`
  margin: 0 25px;
`;

const ParameterDescription = styled.li`
  list-style: none;
  margin-left: 8px;
  line-height: 1.7;

  code {
    background-color: rgba(0, 0, 0, 0.4);
    padding: 3px;
    border-radius: 4px;
    border: 1px solid black;
  }
`;

export const FunctionDeclaration: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  context?: string;
  declaration: api.ClassMethod;
}> = ({ className, style, context, declaration }) => {
  const relatedInterfaces = useMemo(
    () =>
      getInterfacesForFunction(declaration).map(x => (
        <InterfaceDeclaration key={x.name} declaration={x} />
      )),
    [declaration],
  );

  const parameterDescriptions = useMemo(
    () =>
      declaration.args
        .filter(arg => arg.description)
        .map(arg => (
          <ParameterDescription key={arg.name}>
            <code>{arg.name}</code> - {arg.description}
          </ParameterDescription>
        )),
    [declaration],
  );

  const isLinked = useLinkedElement({ scope: context, hash: declaration.name });

  return (
    <FunctionWrapper className={className} style={style} id={declaration.name} isLinked={isLinked}>
      <CommonGroupHeader>
        <FunctionSignature>
          <KindIcon kind="function" size="big" />
          {declaration.name}
          {declaration.abstract && (
            <span title="Abstract: this method does not exist on the class, but it can be implemented on subclass">
              ?
            </span>
          )}
          (
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
      </CommonGroupHeader>
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
