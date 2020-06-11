/* eslint-disable @typescript-eslint/no-explicit-any */

export function getAllCombinations(arr: any[], index?: number): any[][] {
  if (index === undefined) {
    index = 0;
  }
  if (arr.length >= index) {
    return [[]];
  }
  const rest: any[][] = getAllCombinations(arr, index + 1);
  /* optimize by capping at units*/
  return [...rest, ...rest.map((combination: any[]) => [arr[index], ...combination])];
}
