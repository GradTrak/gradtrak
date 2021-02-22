export function validateEmail(email: string): boolean {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

export function getAllCombinations<T>(arr: T[], index?: number): T[][] {
  const i = index !== undefined ? index : 0;
  if (i >= arr.length) {
    return [[]];
  }
  const rest = getAllCombinations(arr, i + 1);
  return [...rest, ...rest.map((combination) => [arr[i], ...combination])];
}

/* https://stackoverflow.com/a/25490531 */
function getCookieValue(key: string): string | undefined {
  const match = document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`);
  return match ? match.pop() : undefined;
}

function csrfRequest(url: string, data: any, method: 'POST' | 'PUT'): Promise<Response> {
  const headers = new Headers();

  // TODO This can be a common config.
  const csrf = getCookieValue('csrf-token');
  if (csrf !== undefined) {
    headers.append('CSRF-Token', csrf);
  }

  if (data) {
    headers.append('Content-Type', 'application/json');
    return fetch(url, {
      method,
      headers,
      body: JSON.stringify(data),
    });
  } else {
    /* Empty request. */
    return fetch(url, {
      method,
      headers,
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
