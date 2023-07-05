import json200Success from '../../../fixtures/calendar-tag/list/200-success.json';
import json200GetSelectionSuccess from '../../../fixtures/calendar-tag/selection/200-success.json';
import json200CreateTagSuccess from '../../../fixtures/calendar-tag/create-tag/200-success.json';
import json200UpdateTagSuccess from '../../../fixtures/calendar-tag/update-tag/200-success.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';
import json400Error from '../../../fixtures/calendar-tag/update-tag/400-invalid-error.json';

const routes = [
  {
    id: 'people/v1/calendar-tag/get-list',
    url: '/people/v1/calendar-tag',
    method: 'GET',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200Success,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500Error,
        },
      },
    ],
  },
  {
    id: 'people/v1/calendar-tag/get-selection',
    url: '/people/v1/calendar-tag/selection',
    method: 'GET',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200GetSelectionSuccess,
        },
      },
    ],
  },
  {
    id: 'people/v1/calendar-tag/create',
    url: '/people/v1/calendar-tag',
    method: 'POST',
    variants: [
      {
        id: '200-create-tag-success',
        type: 'json',
        options: {
          status: 200,
          body: json200CreateTagSuccess,
        },
      },
    ],
  },
  {
    id: 'people/v1/calendar-tag/update',
    url: '/people/v1/calendar-tag/:calendarTagId',
    method: 'PATCH',
    variants: [
      {
        id: '200-update-tag-success',
        type: 'json',
        options: {
          status: 200,
          body: json200UpdateTagSuccess,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500Error,
        },
      },
      {
        id: '400-invalid-error',
        type: 'json',
        options: {
          status: 400,
          body: json400Error,
        },
      },
    ],
  },
];

export default routes;
