import { ISortingField } from './interfaces';

export default function(sorting: ISortingField[] | string | undefined ): string | undefined {
  if (sorting === undefined) {
    return undefined;
  }

  if (Array.isArray(sorting)) {
    return sorting.length === 0 ? undefined :
        sorting.map((field) => ( `${ field.ascending ? '+' : '-' }${field.fieldName.trim()}`  )).join(',');
  }

  const sortingString = sorting.trim();

  return sortingString.length > 0 ? sortingString : undefined;
}
