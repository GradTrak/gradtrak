/**
 * Given an array of arrays, returns all ways of selecting exactly one element from each array.
 *
 * @param {T[][]} sets The array of arrays, from which elements are selected from the inner arrays.
 * @param {number} index The array index at which ot start selecting, used for recursion.
 * @return {T[][]} All possible ways of selecting exactly one element from each inner array.
 */
export function getAllCombinations<T>(sets: T[][], index?: number): T[][] {
  if (index === undefined) {
    index = 0;
  }
  if (index >= sets.length) {
    return [];
  }
  /* optimize by capping at numRequired */
  return sets[index].flatMap((elem: T) => {
    return MultiRequirement.getAllCombinations(sets, index + 1).map((combination: T[]) => [elem, ...combination]);
  });
}
