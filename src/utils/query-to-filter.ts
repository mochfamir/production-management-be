export function parseQueryStringToFilters(queryString: string): any[] {
  const queryStringWithoutPrefix = queryString.startsWith('?')
    ? queryString.slice(1)
    : queryString;

  const queryParams = queryStringWithoutPrefix.split('&');
  const filters: any[] = [];

  queryParams.forEach((param) => {
    const [key, value] = param.split('=');

    let field = key;
    let operator = 'eq';

    const operatorMatch = key.match(/\[(.*?)\]$/);
    if (operatorMatch) {
      field = key.replace(/\[.*?\]$/, '');
      operator = operatorMatch[1];
    }

    filters.push({
      field,
      operator,
      value: decodeURIComponent(value),
    });
  });

  return filters;
}
