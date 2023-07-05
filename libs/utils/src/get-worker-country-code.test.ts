import { WorkerType } from '@ayp/typings/entities';

import { getWorkerCountryCode } from './get-worker-country-code';

describe('getWorkerCountryCode', () => {
  it('should return HK', () => {
    expect(getWorkerCountryCode(WorkerType.HONGKONG)).toEqual('HK');
  });

  it('should return ID', () => {
    expect(getWorkerCountryCode(WorkerType.INDONESIA)).toEqual('ID');
  });

  it('should return MY', () => {
    expect(getWorkerCountryCode(WorkerType.MALAYSIA)).toEqual('MY');
  });

  it('should return PH', () => {
    expect(getWorkerCountryCode(WorkerType.PHILIPPINES)).toEqual('PH');
  });

  it('should return SG', () => {
    expect(getWorkerCountryCode(WorkerType.SINGAPORE)).toEqual('SG');
  });

  it('should return TH', () => {
    expect(getWorkerCountryCode(WorkerType.THAILAND)).toEqual('TH');
  });

  it('should return VN', () => {
    expect(getWorkerCountryCode(WorkerType.VIETNAM)).toEqual('VN');
  });
});
