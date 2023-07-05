export const getNameInitials = (name: string) => {
  const splittedName = name.split(' ');

  const firstInitial = splittedName[0][0];
  let secondInitial;

  if (splittedName.length > 1) {
    secondInitial = splittedName[splittedName.length - 1][0];
  }

  return `${firstInitial}${secondInitial ?? ''}`;
};
