import api from 'dota-data/files/vscripts/api';
import enums from 'dota-data/files/vscripts/enums';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { doSearch, useRouterSearch } from './search';

export type Declaration = typeof topLevelData[number];
export const topLevelData = [...api, ...enums].filter(
  <T extends { kind: string }>(x: T | api.InterfaceDeclaration): x is T => x.kind !== 'interface',
);

export const useFilteredData = () => {
  const search = useRouterSearch();
  const { scope = '' } = useParams<{ scope?: string }>();

  if (search) {
    return { data: doSearch(search.toLowerCase().split(' ')), isSearching: true };
  }

  let data: Declaration[];
  switch (scope) {
    case 'functions':
      data = topLevelData.filter(x => x.kind === 'function');
      break;
    case 'constants':
      data = topLevelData.filter(x => x.kind === 'constant');
      break;
    default:
      data = topLevelData.filter(x => x.name === scope);
  }

  return { data, isSearching: false };
};

const interfaces = _.fromPairs(
  api.filter((x): x is api.InterfaceDeclaration => x.kind === 'interface').map(x => [x.name, x]),
);
export const getInterfacesForTypes = (types: api.Type[]): api.InterfaceDeclaration[] => {
  const unpackedTypes = types.map(type =>
    typeof type === 'object' && 'array' in type ? type.array : type,
  ) as Exclude<api.Type, api.ArrayType>[];
  return _.union(
    unpackedTypes
      .filter(_.isString)
      .map(type => interfaces[type])
      .filter(type => type != null),
    ...unpackedTypes
      .filter((x): x is api.FunctionType => typeof x === 'object')
      .map(func => getInterfacesForTypes([..._.flatMap(func.args, x => x.types), ...func.returns])),
  );
};
