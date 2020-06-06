import api from 'dota-data/files/vscripts/api';
import enums from 'dota-data/files/vscripts/enums';
import { getFuncDeepTypes } from 'dota-data/lib/helpers/vscripts';
import { useHistory, useLocation } from 'react-router-dom';
import { isNotNil } from '~utils/types';
import { Declaration } from './data';

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

export const doSearch = (data: Declaration[], words: string[]) => {
  const typeWords = words.filter(x => x.startsWith('type:')).map(x => x.replace(/^type:/, ''));
  const normalWords = words.filter(x => !x.startsWith('type:'));

  const filterMember = (member: api.ClassMember | enums.EnumMember): boolean => {
    const name = member.name.toLowerCase();
    return normalWords.length > 0 && normalWords.every(word => name.includes(word));
  };

  return data
    .map(declaration => {
      const filteredDeclaration: api.ClassDeclaration | enums.Enum | undefined =
        declaration.kind === 'class'
          ? {
              ...declaration,
              members: declaration.members.filter(member => {
                if (filterMember(member)) return true;

                if (typeWords.length === 0) return false;
                const memberTypes = (member.kind === 'function'
                  ? getFuncDeepTypes(member)
                  : member.types
                ).map(type => type.toLowerCase());
                return typeWords.every(type => memberTypes.some(x => x.includes(type)));
              }),
            }
          : declaration.kind === 'enum'
          ? { ...declaration, members: declaration.members.filter(filterMember) }
          : undefined;

      // TODO: Use optional chaining
      if (filteredDeclaration && filteredDeclaration.members.length > 0) return filteredDeclaration;

      const includeAsType =
        (normalWords.length > 0 &&
          normalWords.every(word => declaration.name.toLowerCase().includes(word))) ||
        (declaration.kind === 'class' &&
          declaration.extend &&
          typeWords.includes(declaration.extend.toLowerCase()));

      if (includeAsType) {
        const element = { ...declaration };
        if (element.kind === 'class' || element.kind === 'enum') element.members = [];
        return element;
      }
    })
    .filter(isNotNil);
};
