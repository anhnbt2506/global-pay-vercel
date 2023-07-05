import { generateCsp } from './generate-csp';

const { env } = process;

describe('generateCsp', () => {
  describe('when environment is test', () => {
    it('should be correct csp with empty object param', () => {
      expect(generateCsp({})).toEqual(
        `connect-src 'self' *.ayp-group.com *.amazonaws.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.hotjar.com https://*.hotjar.io wss://*.hotjar.com api.hubspot.com forms.hubspot.com api.hubapi.com *.hscollectedforms.net *.tinymce.com *.tiny.cloud blob: https://*.userpilot.io *.userpilot.io wss:; default-src 'self' *.ayp-group.com; font-src 'self' fonts.gstatic.com data: https://fonts.gstatic.com https://*.hotjar.com *.tinymce.com *.tiny.cloud; frame-ancestors 'self' https://*.useberry.com; frame-src 'self' *.ayp-group.com *.hubspot.com *.hotjar.com; img-src 'self' *.ayp-group.com fonts.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://www.googletagmanager.com https://*.hotjar.com forms.hsforms.com track.hubspot.com www.facebook.com *.tinymce.com *.tiny.cloud data: blob: https://*.userpilot.io; script-src 'self' https://*.googletagmanager.com https://www.googletagmanager.com https://*.hotjar.com *.tinymce.com *.tiny.cloud https://*.userpilot.io; script-src-elem 'self' *.ayp-group.com *.cloudflareinsights.com https://www.googletagmanager.com https://*.hotjar.com *.hs-scripts.com www.facebook.com connect.facebook.net js.hsadspixel.net js.hs-banner.com js-analytics.net js.hs-analytics.net js.usemessages.com js.hscollectedforms.net *.tiny.cloud https://*.userpilot.io; style-src 'self' fonts.googleapis.com https://fonts.googleapis.com https://tagmanager.google.com https://www.googletagmanager.com https://*.hotjar.com 'unsafe-inline' *.tinymce.com *.tiny.cloud https://*.userpilot.io https://fonts.gstatic.com;`
      );
    });

    it('should be correct csp with non-empty object param', () => {
      expect(
        generateCsp({
          scriptSrcElem: ['nonce-userId-21'],
          scriptSrc: ['https://tinymce.com'],
        })
      ).toEqual(
        `connect-src 'self' *.ayp-group.com *.amazonaws.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.hotjar.com https://*.hotjar.io wss://*.hotjar.com api.hubspot.com forms.hubspot.com api.hubapi.com *.hscollectedforms.net *.tinymce.com *.tiny.cloud blob: https://*.userpilot.io *.userpilot.io wss:; default-src 'self' *.ayp-group.com; font-src 'self' fonts.gstatic.com data: https://fonts.gstatic.com https://*.hotjar.com *.tinymce.com *.tiny.cloud; frame-ancestors 'self' https://*.useberry.com; frame-src 'self' *.ayp-group.com *.hubspot.com *.hotjar.com; img-src 'self' *.ayp-group.com fonts.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://www.googletagmanager.com https://*.hotjar.com forms.hsforms.com track.hubspot.com www.facebook.com *.tinymce.com *.tiny.cloud data: blob: https://*.userpilot.io; script-src 'self' https://*.googletagmanager.com https://www.googletagmanager.com https://*.hotjar.com *.tinymce.com *.tiny.cloud https://*.userpilot.io https://tinymce.com; script-src-elem 'self' *.ayp-group.com *.cloudflareinsights.com https://www.googletagmanager.com https://*.hotjar.com *.hs-scripts.com www.facebook.com connect.facebook.net js.hsadspixel.net js.hs-banner.com js-analytics.net js.hs-analytics.net js.usemessages.com js.hscollectedforms.net *.tiny.cloud https://*.userpilot.io nonce-userId-21; style-src 'self' fonts.googleapis.com https://fonts.googleapis.com https://tagmanager.google.com https://www.googletagmanager.com https://*.hotjar.com 'unsafe-inline' *.tinymce.com *.tiny.cloud https://*.userpilot.io https://fonts.gstatic.com;`
      );
    });
  });

  describe('when environment is development', () => {
    beforeAll(async () => {
      jest.resetModules();
      process.env = { NODE_ENV: 'development' };
    });

    afterAll(() => {
      process.env = env;
    });

    it('should be correct csp with empty object param', async () => {
      const testedGenerateCsp = await import('./generate-csp');

      expect(testedGenerateCsp.generateCsp({})).toEqual(
        `connect-src 'self' *.ayp-group.com localhost:3000 127.0.0.1:3000 *.amazonaws.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.hotjar.com https://*.hotjar.io wss://*.hotjar.com api.hubspot.com forms.hubspot.com api.hubapi.com *.hscollectedforms.net *.tinymce.com *.tiny.cloud blob: https://*.userpilot.io *.userpilot.io wss:; default-src 'self' *.ayp-group.com; font-src 'self' fonts.gstatic.com data: https://fonts.gstatic.com https://*.hotjar.com *.tinymce.com *.tiny.cloud; frame-ancestors 'self' https://*.useberry.com; frame-src 'self' *.ayp-group.com *.hubspot.com *.hotjar.com; img-src 'self' *.ayp-group.com fonts.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://www.googletagmanager.com https://*.hotjar.com forms.hsforms.com track.hubspot.com www.facebook.com *.tinymce.com *.tiny.cloud data: blob: https://*.userpilot.io; script-src 'self' 'unsafe-eval' https://*.googletagmanager.com https://www.googletagmanager.com https://*.hotjar.com *.tinymce.com *.tiny.cloud https://*.userpilot.io; script-src-elem 'self' *.ayp-group.com *.cloudflareinsights.com https://www.googletagmanager.com https://*.hotjar.com *.hs-scripts.com www.facebook.com connect.facebook.net js.hsadspixel.net js.hs-banner.com js-analytics.net js.hs-analytics.net js.usemessages.com js.hscollectedforms.net *.tiny.cloud https://*.userpilot.io; style-src 'self' fonts.googleapis.com https://fonts.googleapis.com https://tagmanager.google.com https://www.googletagmanager.com https://*.hotjar.com 'unsafe-inline' *.tinymce.com *.tiny.cloud https://*.userpilot.io https://fonts.gstatic.com;`
      );
    });

    it('should be correct csp with non-empty object param', async () => {
      const testedGenerateCsp = await import('./generate-csp');

      expect(
        testedGenerateCsp.generateCsp({
          scriptSrcElem: ['nonce-userId-21'],
          scriptSrc: ['https://tinymce.com'],
        })
      ).toEqual(
        `connect-src 'self' *.ayp-group.com localhost:3000 127.0.0.1:3000 *.amazonaws.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.hotjar.com https://*.hotjar.io wss://*.hotjar.com api.hubspot.com forms.hubspot.com api.hubapi.com *.hscollectedforms.net *.tinymce.com *.tiny.cloud blob: https://*.userpilot.io *.userpilot.io wss:; default-src 'self' *.ayp-group.com; font-src 'self' fonts.gstatic.com data: https://fonts.gstatic.com https://*.hotjar.com *.tinymce.com *.tiny.cloud; frame-ancestors 'self' https://*.useberry.com; frame-src 'self' *.ayp-group.com *.hubspot.com *.hotjar.com; img-src 'self' *.ayp-group.com fonts.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://www.googletagmanager.com https://*.hotjar.com forms.hsforms.com track.hubspot.com www.facebook.com *.tinymce.com *.tiny.cloud data: blob: https://*.userpilot.io; script-src 'self' 'unsafe-eval' https://*.googletagmanager.com https://www.googletagmanager.com https://*.hotjar.com *.tinymce.com *.tiny.cloud https://*.userpilot.io https://tinymce.com; script-src-elem 'self' *.ayp-group.com *.cloudflareinsights.com https://www.googletagmanager.com https://*.hotjar.com *.hs-scripts.com www.facebook.com connect.facebook.net js.hsadspixel.net js.hs-banner.com js-analytics.net js.hs-analytics.net js.usemessages.com js.hscollectedforms.net *.tiny.cloud https://*.userpilot.io nonce-userId-21; style-src 'self' fonts.googleapis.com https://fonts.googleapis.com https://tagmanager.google.com https://www.googletagmanager.com https://*.hotjar.com 'unsafe-inline' *.tinymce.com *.tiny.cloud https://*.userpilot.io https://fonts.gstatic.com;`
      );
    });
  });
});
