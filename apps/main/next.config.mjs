/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'autoplay=(), camera=(), geolocation=(), microphone=(), payment=()',
  },
];

const nextConfig = {
  /**
   * Please match the i18n config as in `next-i18next.config.mjs`.
   * The import can't be used as the config has not yet support CommonJS.
   */
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id'],
  },
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    dirs: ['src'],
  },
  images: {
    domains: [
      'flagcdn.com',
      'assets.ayp-group.com',
      'assets-dev.ayp-group.com',
      'assets-uat.ayp-group.com',
    ],
    unoptimized: process.env.NEXT_PUBLIC_STAGE === 'testing',
  },
  headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
};

export default nextConfig;
