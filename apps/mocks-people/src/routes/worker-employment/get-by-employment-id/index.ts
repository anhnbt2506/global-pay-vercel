import json200EmployeeReviewStatus from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-review-status.json';
import json200EmployeeInvitedStatus from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-invited-status.json';
import json200EmployeeReviewStatusHK from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-review-status-hk.json';
import json200EmployeeInvitedStatusHK from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-invited-status-hk.json';
import json200EmployeeReviewStatusPH from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-review-status-ph.json';
import json200EmployeeInvitedStatusPH from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-invited-status-ph.json';
import json200EmployeeReviewStatusSG from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-review-status-sg.json';
import json200EmployeeInvitedStatusSG from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-invited-status-sg.json';
import json200WorkerStatusSuccess from '../../../fixtures/worker-employment/get-by-employment-id/200-worker-status.json';
import json200WorkerEmptyAddendumFilesSuccess from '../../../fixtures/worker-employment/get-by-employment-id/200-worker-status-empty-addendum-files.json';
import json200WorkerOnboardedStatusSuccess from '../../../fixtures/worker-employment/get-by-employment-id/200-worker-onboarded-status.json';
import json200EmployeeReviewStatusMy from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-review-status-my.json';
import json200EmployeeInvitedStatusMy from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-invited-status-my.json';
import json200EmployeeReviewStatusVn from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-review-status-vn.json';
import json200EmployeeInvitedStatusVn from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-invited-status-vn.json';
import json200EmployeeInvitedStatusTh from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-invited-status-th.json';
import json200EmployeeReviewStatusTh from '../../../fixtures/worker-employment/get-by-employment-id/200-employee-review-status-th.json';
import json200GetEmployeeSuccess from '../../../fixtures/worker-employment/get-by-employment-id/200-get-employee-success.json';
import json200GetEmployeeSuccessHkDraft from '../../../fixtures/worker-employment/get-by-employment-id/200-get-employee-success-hk-draft.json';
import json404GetEmployeeError from '../../../fixtures/common/404-not-found-error.json';

const routes = [
  {
    id: 'people/v1/worker-employment/get-by-employment-id',
    url: '/people/v1/worker-employment/:employmentId',
    method: 'GET',
    variants: [
      {
        id: '200-employee-review-status',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeReviewStatus,
        },
      },
      {
        id: '200-employee-invited-status',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeInvitedStatus,
        },
      },
      {
        id: '200-employee-review-status-hk',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeReviewStatusHK,
        },
      },
      {
        id: '200-employee-invited-status-hk',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeInvitedStatusHK,
        },
      },
      {
        id: '200-employee-review-status-ph',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeReviewStatusPH,
        },
      },
      {
        id: '200-employee-invited-status-ph',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeInvitedStatusPH,
        },
      },
      {
        id: '200-employee-review-status-sg',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeReviewStatusSG,
        },
      },
      {
        id: '200-employee-invited-status-sg',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeInvitedStatusSG,
        },
      },
      {
        id: '200-employee-review-status-my',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeReviewStatusMy,
        },
      },
      {
        id: '200-employee-invited-status-my',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeInvitedStatusMy,
        },
      },
      {
        id: '200-employee-review-status-vn',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeReviewStatusVn,
        },
      },
      {
        id: '200-employee-invited-status-vn',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeInvitedStatusVn,
        },
      },
      {
        id: '200-employee-review-status-th',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeReviewStatusTh,
        },
      },
      {
        id: '200-employee-invited-status-th',
        type: 'json',
        options: {
          status: 200,
          body: json200EmployeeInvitedStatusTh,
        },
      },
      {
        id: '200-worker-status-success',
        type: 'json',
        options: {
          status: 200,
          body: json200WorkerStatusSuccess,
        },
      },
      {
        id: '200-worker-status-empty-addendum-files',
        type: 'json',
        options: {
          status: 200,
          body: json200WorkerEmptyAddendumFilesSuccess,
        },
      },
      {
        id: '200-worker-onboarded-status-success',
        type: 'json',
        options: {
          status: 200,
          body: json200WorkerOnboardedStatusSuccess,
        },
      },
      {
        id: '200-get-employee-success-vn',
        type: 'json',
        options: {
          status: 200,
          body: json200GetEmployeeSuccess,
        },
      },
      {
        id: '200-get-employee-success',
        type: 'json',
        options: {
          status: 200,
          body: {
            data: {
              workerEmployment: {
                ...json200GetEmployeeSuccess.data.workerEmployment,
                workerType: 'App\\Models\\Worker\\WorkerThailand',
              },
            },
          },
        },
      },
      {
        id: '200-get-employee-success-hk',
        type: 'json',
        options: {
          status: 200,
          body: {
            data: {
              workerEmployment: {
                ...json200GetEmployeeSuccess.data.workerEmployment,
                workerType: 'App\\Models\\Worker\\WorkerHongkong',
              },
            },
          },
        },
      },
      {
        id: '200-get-employee-success-hk-draft',
        type: 'json',
        options: {
          status: 200,
          body: json200GetEmployeeSuccessHkDraft,
        },
      },
      {
        id: '200-get-employee-success-id',
        type: 'json',
        options: {
          status: 200,
          body: {
            data: {
              workerEmployment: {
                ...json200GetEmployeeSuccess.data.workerEmployment,
                workerType: 'App\\Models\\Worker\\WorkerIndonesia',
              },
            },
          },
        },
      },
      {
        id: '200-get-employee-success-my',
        type: 'json',
        options: {
          status: 200,
          body: {
            data: {
              workerEmployment: {
                ...json200GetEmployeeSuccess.data.workerEmployment,
                workerType: 'App\\Models\\Worker\\WorkerMalaysia',
              },
            },
          },
        },
      },
      {
        id: '200-get-employee-success-ph',
        type: 'json',
        options: {
          status: 200,
          body: {
            data: {
              workerEmployment: {
                ...json200GetEmployeeSuccess.data.workerEmployment,
                workerType: 'App\\Models\\Worker\\WorkerPhilippines',
              },
            },
          },
        },
      },
      {
        id: '200-get-employee-success-sg',
        type: 'json',
        options: {
          status: 200,
          body: {
            data: {
              workerEmployment: {
                ...json200GetEmployeeSuccess.data.workerEmployment,
                workerType: 'App\\Models\\Worker\\WorkerSingapore',
              },
            },
          },
        },
      },
      {
        id: '200-get-employee-success-th',
        type: 'json',
        options: {
          status: 200,
          body: {
            data: {
              workerEmployment: {
                ...json200GetEmployeeSuccess.data.workerEmployment,
                workerType: 'App\\Models\\Worker\\WorkerThailand',
              },
            },
          },
        },
      },
      {
        id: '404-error',
        type: 'json',
        options: {
          status: 404,
          body: json404GetEmployeeError,
        },
      },
    ],
  },
];

export default routes;
