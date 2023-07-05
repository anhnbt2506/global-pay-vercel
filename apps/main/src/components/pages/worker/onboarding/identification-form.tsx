import { CitizenshipStatus } from '@ayp/typings/entities';
import { getWorkerCountryCode } from '@ayp/utils';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { Dispatch, FC, useEffect, useMemo } from 'react';
import type { SchemaOf } from 'yup';

import { TextField } from '@components/ui';
import { Grid } from '@mui/material';

import {
  WorkerOnboardingFormValues,
  WorkerOnboardingPage,
  validationSchema as commonValidationSchema,
} from './config';

interface IdentificationFormProps {
  workerCountryCode: string;
  setWorkerCountryCode: Dispatch<string>;
  setValidationSchema: Dispatch<SchemaOf<unknown>>;
}

const IdentificationForm: FC<IdentificationFormProps> = ({
  workerCountryCode,
  setValidationSchema,
  setWorkerCountryCode,
}) => {
  const { t } = useTranslation('worker-onboarding');

  const {
    values: { workerType, citizenshipStatus },
  } = useFormikContext<WorkerOnboardingFormValues>();

  useEffect(() => {
    /* istanbul ignore next */
    // this case doesn't necessary to test
    if (!workerType) return;
    (async () => {
      setWorkerCountryCode(
        getWorkerCountryCode(workerType).toLocaleLowerCase()
      );
      const countrySpecificValidationSchema = (
        await import(
          `@components/pages/worker/onboarding/configs/identification/${
            citizenshipStatus === CitizenshipStatus.PERMIT_HOLDER
              ? `is-permit-holder`
              : `is-not-permit-holder`
          }/${getWorkerCountryCode(workerType).toLocaleLowerCase()}`
        )
      ).validationSchema;

      const identificationFormValidationSchema =
        countrySpecificValidationSchema.concat(
          commonValidationSchema[WorkerOnboardingPage.IDENTIFICATION]
        );

      setValidationSchema(identificationFormValidationSchema);
    })();
  }, [
    workerType,
    citizenshipStatus,
    setValidationSchema,
    setWorkerCountryCode,
  ]);

  const form = useMemo(() => {
    /* istanbul ignore next */
    // this case doesn't necessary to test
    if (!workerCountryCode) return <></>;

    const DynamicForm = dynamic(
      () =>
        import(
          `@components/pages/worker/onboarding/identification/${
            citizenshipStatus === CitizenshipStatus.PERMIT_HOLDER
              ? `is-permit-holder`
              : `is-not-permit-holder`
          }/${workerCountryCode}`
        )
    );

    const Form = (
      <Grid container spacing={2} maxWidth="sm">
        <DynamicForm />
        <Grid item xs={12}>
          <TextField
            required
            name="workerIdentity.taxId"
            label={t('identification.form.workerIdentity.taxId.label')}
            helperText={t(
              'identification.form.workerIdentity.taxId.helperText'
            )}
            dataTestId="workerOnboarding-identification-field-workerIdentity.taxId"
          />
        </Grid>
      </Grid>
    );
    return Form;
  }, [workerCountryCode, citizenshipStatus, t]);

  return form;
};

export default IdentificationForm;
