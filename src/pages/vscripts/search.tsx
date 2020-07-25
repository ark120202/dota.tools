import api from 'dota-data/files/vscripts/api';
import enums from 'dota-data/files/vscripts/enums';
import { getFuncDeepTypes } from 'dota-data/lib/helpers/vscripts';
import { useHistory, useLocation } from 'react-router-dom';
import { isNotNil } from '~utils/types';
import { Declaration, topLevelData } from './data';

export function useRouterSearch() {
  const location = useLocation();
  return new URLSearchParams(location.search).get('search') ?? '';
}

export function useSetSearchQuery() {
  const history = useHistory<{ searchReferrer?: string }>();

  return (query: string) => {
    const { state, pathname, search } = history.location;
    if (query === '') {
      history.push(state?.searchReferrer || '/vscripts');
    } else {
      const searchReferrer = state?.searchReferrer || `${pathname}${search}`;
      history.push(`/vscripts?search=${encodeURIComponent(query)}`, { searchReferrer });
    }
  };
}

const AVAILABILITY_PATTERN = /^-?on:(client|server)$/;
export const doSearch = (words: string[]) => {
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
};
