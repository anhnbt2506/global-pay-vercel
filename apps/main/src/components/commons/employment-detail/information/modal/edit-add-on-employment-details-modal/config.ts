import { mapFilterObject } from '@ayp/utils';

import { WorkerEmploymentFormValues } from '../../config';

const defaultMapToRequestBody = (state: WorkerEmploymentFormValues) =>
  mapFilterObject(
    Object.assign(
      {},
      { additionalInfo: state.additionalInfo },
      {
        workerRemuneration: {
          monthlyAllowance: state.workerRemuneration.monthlyAllowance,
        },
      }
    ),
    (value) => (value !== '' ? value : null)
  );

export const mapToRequestBody = async (
  state: WorkerEmploymentFormValues,
  countryCode: string
) => {
  try {
    const { mapToRequestBody } = await import(
      `./country-specific-form/config/${countryCode.toLocaleLowerCase()}`
    );
    return mapToRequestBody(state);
  } catch (e) {
    return defaultMapToRequestBody(state);
  }
};
