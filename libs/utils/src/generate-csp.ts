import { union } from './union';

interface CspDirective {
  connectSrc: string[];
  defaultSrc: string[];
  fontSrc: string[];
  frameAncestors: string[];
  frameSrc: string[];
  imgSrc: string[];
  scriptSrc: string[];
  scriptSrcElem: string[];
  styleSrc: string[];
}

export const generateCsp = ({
  connectSrc = [],
  defaultSrc = [],
  fontSrc = [],
  frameAncestors = [],
  frameSrc = [],
  imgSrc = [],
  scriptSrc = [],
  scriptSrcElem = [],
  styleSrc = [],
}: Partial<CspDirective>): string => {
  const csp = `
    connect-src ${convertToCspString(union(connectSrcBase, connectSrc))};
    default-src ${convertToCspString(union(defaultSrcBase, defaultSrc))};
    font-src ${convertToCspString(union(fontSrcBase, fontSrc))};
    frame-ancestors ${convertToCspString(
      union(frameAncestorsBase, frameAncestors)
    )};
    frame-src ${convertToCspString(union(frameSrcBase, frameSrc))};
    img-src ${convertToCspString(union(imgSrcBase, imgSrc))};
    script-src ${convertToCspString(union(scriptSrcBase, scriptSrc))};
    script-src-elem ${convertToCspString(
      union(scriptSrcElemBase, scriptSrcElem)
    )};
    style-src ${convertToCspString(union(styleSrcBase, styleSrc))};
  `;

  return csp.replace(/\s{2,}/g, ' ').trim();
};

const convertToCspString = (rules: string[]) =>
  rules.filter((item) => item.length).join(' ');

const awsCsp: Partial<CspDirective> = {
  connectSrc: ['*.amazonaws.com'],
};

const cloudflareCsp: Partial<CspDirective> = {
  scriptSrcElem: ['*.cloudflareinsights.com'],
};

// https://developers.google.com/tag-platform/tag-manager/web/csp#google_analytics_4_google_analytics
const ga4Csp: Partial<CspDirective> = {
  connectSrc: [
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://*.googletagmanager.com',
  ],
  imgSrc: ['https://*.google-analytics.com', 'https://*.googletagmanager.com'],
  scriptSrc: ['https://*.googletagmanager.com'],
};

// https://developers.google.com/tag-platform/tag-manager/web/csp
const gtmCsp: Partial<CspDirective> = {
  fontSrc: ['data:', 'https://fonts.gstatic.com'],
  imgSrc: [
    'https://ssl.gstatic.com',
    'https://www.gstatic.com',
    'https://www.googletagmanager.com',
  ],
  scriptSrc: ['https://www.googletagmanager.com'],
  scriptSrcElem: ['https://www.googletagmanager.com'],
  styleSrc: [
    'https://fonts.googleapis.com',
    'https://tagmanager.google.com',
    'https://www.googletagmanager.com',
  ],
};

const hubspotCsp: Partial<CspDirective> = {
  connectSrc: [
    'api.hubspot.com',
    'forms.hubspot.com',
    'api.hubapi.com',
    '*.hscollectedforms.net',
  ],
  frameSrc: ['*.hubspot.com'],
  imgSrc: ['forms.hsforms.com', 'track.hubspot.com', 'www.facebook.com'],
  scriptSrcElem: [
    '*.hs-scripts.com',
    'www.facebook.com',
    'connect.facebook.net',
    'js.hsadspixel.net',
    'js.hs-banner.com',
    'js-analytics.net',
    'js.hs-analytics.net',
    'js.usemessages.com',
    'js.hs-analytics.net',
    'js.hscollectedforms.net',
  ],
};

// https://www.tiny.cloud/docs/tinymce/6/tinymce-and-csp/
const tinyMceCsp: Partial<CspDirective> = {
  connectSrc: ['*.tinymce.com', '*.tiny.cloud', 'blob:'],
  fontSrc: ['*.tinymce.com', '*.tiny.cloud'],
  imgSrc: ['*.tinymce.com', '*.tiny.cloud', 'data:', 'blob:'],
  scriptSrc: ['*.tinymce.com', '*.tiny.cloud'],
  scriptSrcElem: ['*.tiny.cloud'],
  styleSrc: ["'unsafe-inline'", '*.tinymce.com', '*.tiny.cloud'],
};

const useberry: Partial<CspDirective> = {
  frameAncestors: ['https://*.useberry.com'],
};

const userPilotCsp: Partial<CspDirective> = {
  connectSrc: ['https://*.userpilot.io', '*.userpilot.io', 'wss:'],
  imgSrc: ['https://*.userpilot.io'],
  scriptSrc: ['https://*.userpilot.io'],
  scriptSrcElem: ['https://*.userpilot.io'],
  styleSrc: [
    'https://*.userpilot.io',
    'https://fonts.gstatic.com',
    'https://fonts.googleapis.com',
  ],
};

const hotjarCsp: Partial<CspDirective> = {
  connectSrc: [
    'https://*.hotjar.com',
    'https://*.hotjar.io',
    'wss://*.hotjar.com',
  ],
  fontSrc: ['https://*.hotjar.com'],
  frameSrc: ['*.hotjar.com'],
  imgSrc: ['https://*.hotjar.com'],
  scriptSrc: ['https://*.hotjar.com'],
  scriptSrcElem: ['https://*.hotjar.com'],
  styleSrc: ['https://*.hotjar.com'],
};

const defaultSrcBase = ["'self'", '*.ayp-group.com'];

const connectSrcBase = union(
  [
    "'self'",
    '*.ayp-group.com',
    process.env.NODE_ENV === 'development'
      ? 'localhost:3000 127.0.0.1:3000'
      : '',
  ],
  awsCsp.connectSrc,
  ga4Csp.connectSrc,
  hotjarCsp.connectSrc,
  hubspotCsp.connectSrc,
  tinyMceCsp.connectSrc,
  userPilotCsp.connectSrc
);

const fontSrcBase = union(
  ["'self'", 'fonts.gstatic.com'],
  gtmCsp.fontSrc,
  hotjarCsp.fontSrc,
  tinyMceCsp.fontSrc
);

const frameAncestorsBase = union(["'self'"], useberry.frameAncestors);

const frameSrcBase = union(
  ["'self'", '*.ayp-group.com'],
  hubspotCsp.frameSrc,
  hotjarCsp.frameSrc
);

const imgSrcBase = union(
  ["'self'", '*.ayp-group.com', 'fonts.gstatic.com'],
  ga4Csp.imgSrc,
  gtmCsp.imgSrc,
  hotjarCsp.imgSrc,
  hubspotCsp.imgSrc,
  tinyMceCsp.imgSrc,
  userPilotCsp.imgSrc
);

const scriptSrcBase = union(
  ["'self'", process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''],
  ga4Csp.scriptSrc,
  gtmCsp.scriptSrc,
  hotjarCsp.scriptSrc,
  tinyMceCsp.scriptSrc,
  userPilotCsp.scriptSrc
);

const scriptSrcElemBase = union(
  ["'self'", '*.ayp-group.com'],
  cloudflareCsp.scriptSrcElem,
  gtmCsp.scriptSrcElem,
  hotjarCsp.scriptSrcElem,
  hubspotCsp.scriptSrcElem,
  tinyMceCsp.scriptSrcElem,
  userPilotCsp.scriptSrcElem
);

const styleSrcBase = union(
  ["'self'", 'fonts.googleapis.com'],
  gtmCsp.styleSrc,
  hotjarCsp.styleSrc,
  tinyMceCsp.styleSrc,
  userPilotCsp.styleSrc
);
