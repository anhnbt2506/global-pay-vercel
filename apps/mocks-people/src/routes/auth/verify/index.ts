import json200HasNotSetPassword from '../../../fixtures/auth/verify/200-has-not-set-password.json';
import json200HasSetPassword from '../../../fixtures/auth/verify/200-has-set-password.json';
import json400VerificationLinkExpired from '../../../fixtures/auth/verify/400-verification-link-expired.json';
import json400VerificationLinkInvalid from '../../../fixtures/auth/verify/400-verification-link-invalid.json';

const routes = [
  {
    id: 'people/v1/auth/verify',
    url: '/people/v1/auth/verify',
    method: 'POST',
    variants: [
      {
        id: '200-has-not-set-password',
        type: 'json',
        options: {
          status: 200,
          body: json200HasNotSetPassword,
        },
      },
      {
        id: '200-has-set-password',
        type: 'json',
        options: {
          status: 200,
          body: json200HasSetPassword,
        },
      },
      {
        id: '400-verification-link-expired',
        type: 'json',
        options: {
          status: 400,
          body: json400VerificationLinkExpired,
        },
      },
      {
        id: '400-verification-link-invalid',
        type: 'json',
        options: {
          status: 400,
          body: json400VerificationLinkInvalid,
        },
      },
    ],
  },
];

export default routes;
