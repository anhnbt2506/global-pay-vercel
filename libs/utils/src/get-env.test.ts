import { Environment } from '.';

describe('getEnv', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  it('should return correct environment', () => {
    process.env.NEXT_PUBLIC_STAGE = 'dev';
    process.env.NEXT_PUBLIC_VERSION = 'git-sha/tag';
    process.env.NEXT_PUBLIC_GATEWAY_HOST = 'global-pay';
    process.env.NEXT_PUBLIC_PEOPLE_API_HOST = 'global-pay';
    process.env.NEXT_PUBLIC_FINTECH_API_HOST = 'global-pay';
    process.env.NEXT_PUBLIC_TINYMCE_API_KEY = 'tinymce';
    process.env.NEXTAUTH_SECRET = 'nextauth-secret';
    process.env.NEXT_PUBLIC_TABLEAU_HOST_URL = 'host-url';
    process.env.NEXT_PUBLIC_TABLEAU_DASHBOARD_NAME = 'dashboard-name';
    process.env.NEXT_PUBLIC_GTM_ID = 'GTM-ID';
    process.env.NEXT_PUBLIC_HJID = 'HJID';
    process.env.NEXT_PUBLIC_USER_PILOT_TOKEN = 'USER-PILOT-TOKEN';

    expect(Environment.getStage()).toBe('dev');
    expect(Environment.getVersion()).toBe('git-sha/tag');
    expect(Environment.getGatewayHost()).toBe('global-pay');
    expect(Environment.getPeopleApiHost()).toBe('global-pay');
    expect(Environment.getFintechApiHost()).toBe('global-pay');
    expect(Environment.getTinyMceApiKey()).toBe('tinymce');
    expect(Environment.getNextAuthSecret()).toBe('nextauth-secret');
    expect(Environment.getTableauHostUrl()).toBe('host-url');
    expect(Environment.getTableauDashboardName()).toBe('dashboard-name');
    expect(Environment.getGtmId()).toBe('GTM-ID');
    expect(Environment.getHjid()).toBe('HJID');
    expect(Environment.getUserPilotToken()).toBe('USER-PILOT-TOKEN');
  });

  it('should throw respective error message when the environment has not been set', () => {
    try {
      Environment.getPeopleApiHost();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});
