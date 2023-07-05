const getEnvOrThrow = <T = string>(name: string, env?: string): T => {
  if (!env) {
    throw new Error(`Environment variable for ${name} has not been set`);
  }

  return env as T;
};

export const Environment = {
  /**
   * NextJS doesn't allow on destructuring process.env due to security reasons.
   * https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables
   */
  getStage: () =>
    getEnvOrThrow('NEXT_PUBLIC_STAGE', process.env.NEXT_PUBLIC_STAGE),
  getVersion: () => process.env.NEXT_PUBLIC_VERSION,
  getNextAuthUrl: () =>
    typeof window === 'undefined'
      ? process.env.NEXTAUTH_URL
      : window.location.origin,
  getNextAuthSecret: () =>
    getEnvOrThrow('NEXTAUTH_SECRET', process.env.NEXTAUTH_SECRET),
  getGatewayHost: () =>
    getEnvOrThrow(
      'NEXT_PUBLIC_GATEWAY_HOST',
      process.env.NEXT_PUBLIC_GATEWAY_HOST
    ),
  getPeopleApiHost: () =>
    getEnvOrThrow(
      'NEXT_PUBLIC_PEOPLE_API_HOST',
      process.env.NEXT_PUBLIC_PEOPLE_API_HOST
    ),
  getFintechApiHost: () =>
    getEnvOrThrow(
      'NEXT_PUBLIC_FINTECH_API_HOST',
      process.env.NEXT_PUBLIC_FINTECH_API_HOST
    ),
  getTinyMceApiKey: () =>
    getEnvOrThrow(
      'NEXT_PUBLIC_TINYMCE_API_KEY',
      process.env.NEXT_PUBLIC_TINYMCE_API_KEY
    ),
  getTableauHostUrl: () =>
    getEnvOrThrow(
      'NEXT_PUBLIC_TABLEAU_HOST_URL',
      process.env.NEXT_PUBLIC_TABLEAU_HOST_URL
    ),
  getTableauDashboardName: () =>
    getEnvOrThrow(
      'NEXT_PUBLIC_TABLEAU_DASHBOARD_NAME',
      process.env.NEXT_PUBLIC_TABLEAU_DASHBOARD_NAME
    ),
  getGtmId: () =>
    getEnvOrThrow('NEXT_PUBLIC_GTM_ID', process.env.NEXT_PUBLIC_GTM_ID),
  getHjid: () =>
    getEnvOrThrow<number>('NEXT_PUBLIC_HJID', process.env.NEXT_PUBLIC_HJID),
  getUserPilotToken: () =>
    getEnvOrThrow(
      'NEXT_PUBLIC_USER_PILOT_TOKEN',
      process.env.NEXT_PUBLIC_USER_PILOT_TOKEN
    ),
};
