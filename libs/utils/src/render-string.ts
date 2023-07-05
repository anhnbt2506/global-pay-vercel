export const renderString = (
  str: string,
  variables: Record<string, unknown>,
  fallback?: string
) => {
  const regex = new RegExp('{{(.+?)}}', 'g');

  return str.replace(
    regex,
    (_word, token) => variables[token] ?? fallback ?? token
  );
};
