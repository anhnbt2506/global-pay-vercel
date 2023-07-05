import { set } from 'date-fns';

const PARAMETERS = ['hours', 'minutes', 'seconds', 'milliseconds'];

const extractSecondsAndMilliSeconds = (value: number) => {
  const split = value.toString().split('.');

  return {
    seconds: split[0],
    milliseconds: split[1] ?? 0,
  };
};

export const convertTimeToDateTime = (time: string) => {
  const arrayTime = time.split(':').map((i: string): number => +i);
  const parameters = arrayTime.reduce(
    (prev, value, idx) =>
      Object.assign(
        prev,
        PARAMETERS[idx] === 'seconds'
          ? extractSecondsAndMilliSeconds(value)
          : {
              [PARAMETERS[idx]]: value,
            }
      ),
    {}
  );

  return set(new Date(), parameters);
};
