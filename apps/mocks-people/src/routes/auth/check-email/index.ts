import json200HasNotSetPassword from '../../../fixtures/auth/check-email/200-has-not-set-password.json';
import json200HasNotVerifyEmail from '../../../fixtures/auth/check-email/200-has-not-verify-email.json';
import json200HasSetPassword from '../../../fixtures/auth/check-email/200-has-set-password.json';
import json200IsNotAllowedToLogin from '../../../fixtures/auth/check-email/200-is-not-allowed-to-login.json';
import json400EmailNotExist from '../../../fixtures/auth/check-email/400-email-not-exist.json';
import json500UnknownError from '../../../fixtures/common/500-unknown-error.json';

const routes = [
  {
    id: 'people/v1/auth/check-email',
    url: '/people/v1/auth/check-email',
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
        id: '200-has-not-verify-email',
        type: 'json',
        options: {
          status: 200,
          body: json200HasNotVerifyEmail,
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
        id: '200-is-not-allowed-to-login',
        type: 'json',
        options: {
          status: 200,
          body: json200IsNotAllowedToLogin,
        },
      },
      {
        id: '400-email-not-exist',
        type: 'json',
        options: {
          status: 400,
          body: json400EmailNotExist,
        },
      },
      {
        id: '500-unknown-error',
        type: 'json',
        options: {
          status: 500,
          body: json500UnknownError,
        },
      },
    ],
  },
];

export default routes;
