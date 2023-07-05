export const truncate = (str: string) => {
  const maxLength = 20;

  if (str.length <= maxLength) {
    return str;
  }

  return str.slice(0, 5) + '...' + str.slice(str.length - 8, str.length);
};
