import { getAssetUrl } from './get-asset-url';

describe('getAssetUrl', () => {
  const KEY_MOCK = 'template.xlsx';

  it('should return the correct asset url when STAGE is dev', () => {
    process.env.NEXT_PUBLIC_STAGE = 'dev';
    expect(getAssetUrl(KEY_MOCK)).toBe(
      `https://assets-dev.ayp-group.com/${KEY_MOCK}`
    );
  });

  it('should return the correct asset url when STAGE is uat', () => {
    process.env.NEXT_PUBLIC_STAGE = 'uat';
    expect(getAssetUrl(KEY_MOCK)).toBe(
      `https://assets-uat.ayp-group.com/${KEY_MOCK}`
    );
  });

  it('should return the correct asset url when STAGE is prod', () => {
    process.env.NEXT_PUBLIC_STAGE = 'prod';
    expect(getAssetUrl(KEY_MOCK)).toBe(
      `https://assets.ayp-group.com/${KEY_MOCK}`
    );
  });

  it('should return the correct asset url when STAGE is testing', () => {
    process.env.NEXT_PUBLIC_STAGE = 'testing';
    expect(getAssetUrl(KEY_MOCK)).toBe(
      `https://assets-dev.ayp-group.com/${KEY_MOCK}`
    );
  });
});
