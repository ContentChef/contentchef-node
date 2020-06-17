import serializeSorting from '../serializeSorting';

describe('sorting will be serialized', () => {
  it('undefined will be serialized as undefined', () => {
    expect(serializeSorting(undefined)).not.toBeDefined();
  });

  it(`a string is used, will be returned trimmed`, () => {
    expect(serializeSorting(' +publicId')).toEqual('+publicId');
  });

  it(`an empty string is used, undefined serialized`, () => {
    expect(serializeSorting(' ')).not.toBeDefined();
  });

  it('array with one item with publicId descrending', () => {
    expect(serializeSorting([ { fieldName: 'publicId', ascending: false } ])).toEqual('-publicId');
  });

  it('array with one item with publicId ascending', () => {
    expect(serializeSorting([ { fieldName: 'publicId', ascending: true } ])).toEqual('+publicId');
  });

  it('array with one two field one ascending the second descending', () => {
    expect(serializeSorting([ { fieldName: 'publicId', ascending: true }, { fieldName: ' onlineDate', ascending: false } ])).toEqual('+publicId,-onlineDate');
  });
});
