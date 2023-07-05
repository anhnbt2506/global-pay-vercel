import { CountryCode } from '@ayp/typings/commons';
import { WorkerType } from '@ayp/typings/entities';

export const getWorkerCountryCode = (workerType: WorkerType): CountryCode => {
  switch (workerType) {
    case WorkerType.HONGKONG:
      return CountryCode.HONGKONG;
    case WorkerType.INDONESIA:
      return CountryCode.INDONESIA;
    case WorkerType.MALAYSIA:
      return CountryCode.MALAYSIA;
    case WorkerType.PHILIPPINES:
      return CountryCode.PHILIPPINES;
    case WorkerType.SINGAPORE:
      return CountryCode.SINGAPORE;
    case WorkerType.THAILAND:
      return CountryCode.THAILAND;
    case WorkerType.VIETNAM:
      return CountryCode.VIETNAM;
  }
};
