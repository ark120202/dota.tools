import api from 'dota-data/files/vscripts/api';
import enums from 'dota-data/files/vscripts/enums';
import { allData, getFuncDeepTypes } from 'dota-data/lib/helpers/vscripts';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { useRouterSearch } from '~components/Search';
import { isNotNil } from '~utils/types';

export type Declaration = typeof topLevelData[number];
export const topLevelData = allData.filter(
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
export function getInterfacesForTypes(types: api.Type[]): api.InterfaceDeclaration[] {
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
}

const AVAILABILITY_PATTERN = /^-?on:(client|server)$/;

export function doSearch(words: string[]) {
  const availabilityWords = words.filter(x => AVAILABILITY_PATTERN.test(x));
  const typeWords = words.filter(x => x.startsWith('type:')).map(x => x.replace(/^type:/, ''));
  const nameWords = words.filter(x => !x.startsWith('type:') && !AVAILABILITY_PATTERN.test(x));

  function filterAvailability(member: { available: api.Availability } | {}) {
    if (availabilityWords.length === 0) return undefined;
    if (!('available' in member)) return false;

    if (member.available === 'server') {
      return availabilityWords.includes('on:server');
    }

    if (member.available === 'client') {
      return availabilityWords.includes('on:client');
    }

    return !availabilityWords.includes('-on:server') && !availabilityWords.includes('-on:client');
  }

  function filterMemberType(member: api.ClassMember) {
    if (typeWords.length === 0) return undefined;

    const types = (member.kind === 'function' ? getFuncDeepTypes(member) : member.types).map(type =>
      type.toLowerCase(),
    );
    return typeWords.every(type => types.some(x => x.includes(type)));
  }

  function filterDeclarationType(declaration: Declaration) {
    if (typeWords.length === 0) return undefined;

    return (
      declaration.kind === 'class' &&
      declaration.extend !== undefined &&
      typeWords.includes(declaration.extend.toLowerCase())
    );
  }

  function filterName(member: { name: string }) {
    if (nameWords.length === 0) return undefined;

    const name = member.name.toLowerCase();
    return nameWords.every(word => name.includes(word));
  }

  const composeFilters = <T,>(filters: ((member: T) => boolean | undefined)[]) => (value: T) => {
    const results = filters.map(fn => fn(value));
    if (results.includes(false)) return false;
    if (results.includes(true)) return true;
    return false;
  };

  return topLevelData
    .map(declaration => {
      const partialDeclaration: api.ClassDeclaration | enums.Enum | undefined =
        declaration.kind === 'class'
          ? {
              ...declaration,
              members: declaration.members.filter(
                composeFilters([filterName, filterAvailability, filterMemberType]),
              ),
            }
          : declaration.kind === 'enum'
          ? {
              ...declaration,
              members: declaration.members.filter(composeFilters([filterName, filterAvailability])),
            }
          : undefined;

      if (partialDeclaration && partialDeclaration.members.length > 0) {
        return partialDeclaration;
      }

      if (composeFilters([filterName, filterAvailability, filterDeclarationType])(declaration)) {
        const element = { ...declaration };
        if (element.kind === 'class' || element.kind === 'enum') element.members = [];
        return element;
      }
    })
    .filter(isNotNil);
}
