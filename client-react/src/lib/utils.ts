export function validateEmail(email: string): boolean {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

export function getAllCombinations<T>(arr: T[], index?: number): T[][] {
  if (index === undefined) {
    index = 0;
  }
  if (index >= arr.length) {
    return [[]];
  }
  const rest: T[][] = getAllCombinations(arr, index + 1);
  return [...rest, ...rest.map((combination: T[]) => [arr[index], ...combination])];
}

export function get(url: string): Promise<Response> {
  return fetch(url);
}

export function post(url: string, data: any): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function put(url: string, data: any): Promise<Response> {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
