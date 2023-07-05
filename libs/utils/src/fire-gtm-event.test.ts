import { fireGtmEvent } from './fire-gtm-event';

const { dataLayer } = window;

describe('fireGtmEvent', () => {
  describe('when window.dataLayer is defined', () => {
    beforeAll(() => {
      window.dataLayer = { push: jest.fn() };
    });

    afterAll(() => {
      window.dataLayer = dataLayer;
    });

    it('should be mock function', () => {
      expect(jest.isMockFunction(window.dataLayer.push)).toBe(true);
    });

    it('should fire GTM event', () => {
      fireGtmEvent({ userId: 'userId' });
      expect(window.dataLayer.push).toHaveBeenCalledWith({ userId: 'userId' });
    });
  });

  describe('when window.dataLayer is undefined', () => {
    beforeAll(() => {
      window.dataLayer = undefined;
    });

    afterAll(() => {
      window.dataLayer = dataLayer;
    });

    it('should not fire GTM event', () => {
      fireGtmEvent({ userId: 'userId' });
      expect(window.dataLayer).toBeUndefined();
    });
  });
});
