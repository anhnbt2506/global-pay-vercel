import json200Success from '../../fixtures/s3-api/upload/200-success.json';
import json404NotFound from '../../fixtures/common/404-not-found-error.json';
import json200DownloadCsvSuccess from '../../fixtures/s3-api/download/200-success.json';

const routes = [
  {
    id: 's3Api-upload',
    url: '/s3',
    method: 'PUT',
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
        id: '404-not-found',
        type: 'json',
        options: {
          status: 404,
          body: json404NotFound,
        },
      },
    ],
  },
  {
    id: 's3Api-download',
    url: 'https://gp-backend-uat-private.s3.ap-southeast-1.amazonaws.com/export/1',
    method: 'GET',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200DownloadCsvSuccess,
        },
      },
      {
        id: '404-not-found',
        type: 'json',
        options: {
          status: 404,
          body: json404NotFound,
        },
      },
    ],
  },
];

export default routes;
