import api from 'dota-data/files/vscripts/api';
import { findTypeByName } from 'dota-data/lib/helpers/vscripts';
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ColoredSyntax, ColoredSyntaxKind, getSyntaxColorFor } from '~components/ColoredSyntax';
import { colors } from '~utils/constants';
import ArrowIcon from './arrow.svg';

export const Types: React.FC<{ types: api.Type[] }> = ({ types }) => (
  <>
    {types.map((type, index) => [
      <Type key={index} type={type} />,
      types.length - 1 !== index && ' | ',
    ])}
  </>
);

const TypeReferenceLink = styled(NavLink)`
  &.active {
    text-decoration: none;
  }
`;

const TypeReference: React.FC<{ name: string }> = ({ name }) => {
  const [kind, scope, hash] = useMemo((): [ColoredSyntaxKind, string?, string?] => {
    if (name === 'nil') return ['nil'];

    const type = findTypeByName(name);
    if (!type || type.kind === 'primitive' || type.kind === 'nominal') {
      return ['literal'];
    }

    return [
      'interface',
      type.kind === 'class' || type.kind === 'enum'
        ? name
        : type.kind === 'constant'
        ? 'constants'
        : type.kind === 'function'
        ? 'functions'
        : undefined,
      type.kind === 'constant' || type.kind === 'function' ? name : undefined,
    ];
  }, [name]);

  const urlHash = hash ? `#${hash}` : '';
  const style: React.CSSProperties = { textDecorationColor: getSyntaxColorFor(kind) };
  return scope ? (
    <TypeReferenceLink to={`/vscripts/${scope}${urlHash}`} style={style}>
      <ColoredSyntax kind={kind}>{name}</ColoredSyntax>
    </TypeReferenceLink>
  ) : (
    <span style={style}>
      <ColoredSyntax kind={kind}>{name}</ColoredSyntax>
    </span>
  );
};

const ArrayType: React.FC<{ type: api.Type }> = ({ type }) => (
  <span>
    [<Type type={type} />]
  </span>
);

const Type: React.FC<{ type: api.Type }> = ({ type }) =>
  typeof type === 'string' ? (
    <TypeReference name={type} />
  ) : 'array' in type ? (
    <ArrayType type={type.array} />
  ) : (
    <FunctionType {...type} />
  );

export const FunctionParameter: React.FC<{ name: string; types: api.Type[] }> = ({
  name,
  types,
}) => (
  <span>
    <ColoredSyntax kind="parameter">{name}</ColoredSyntax>:&nbsp;
    <Types types={types} />
  </span>
);

const FunctionType: React.FC<api.FunctionType> = (props) => (
  <span>
    (
    {props.args.map((arg) => (
      <FunctionParameter key={arg.name} {...arg} />
    ))}
    ) <FunctionArrowIcon /> <Types types={props.returns} />
  </span>
);

const FunctionArrowIcon = styled(ArrowIcon).attrs({ height: 17, width: 28 })`
  path {
    fill: ${colors.text};
  }
`;
