/* eslint-disable @typescript-eslint/no-explicit-any */

export function getAllCombinations(arr: any[], index?: number): any[][] {
  if (index === undefined) {
    index = 0;
  }
  if (index >= arr.length) {
    return [[]];
  }
  const rest: any[][] = getAllCombinations(arr, index + 1);
  return [...rest, ...rest.map((combination: any[]) => [arr[index], ...combination])];
}
