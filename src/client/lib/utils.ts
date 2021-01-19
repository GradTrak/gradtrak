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

/* https://stackoverflow.com/a/25490531 */
function getCookieValue(key: string): string {
  const match = document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`);
  return match && match.pop();
}

function csrfRequest(url: string, data: any, method: 'POST' | 'PUT'): Promise<Response> {
  // TODO This can be a common config.
  const csrf = getCookieValue('csrf-token');

  if (data) {
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrf,
      },
      body: JSON.stringify(data),
    });
  } else {
    /* Empty request. */
    return fetch(url, {
      method,
      headers: {
        'CSRF-Token': csrf,
      },
    });
  }
}

export function get(url: string): Promise<Response> {
  return fetch(url);
}

export function post(url: string, data: any): Promise<Response> {
  return csrfRequest(url, data, 'POST');
}

export function put(url: string, data: any): Promise<Response> {
  return csrfRequest(url, data, 'PUT');
}
