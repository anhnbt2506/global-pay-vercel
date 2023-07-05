import {
  FileManagementContext,
  FileManagementContextType,
} from '@ayp/typings/commons';
import { CitizenshipStatus } from '@ayp/typings/entities';
import { getWorkerCountryCode } from '@ayp/utils';
import { useFormikContext } from 'formik';
import dynamic from 'next/dynamic';
import { Dispatch, FC, useEffect, useMemo } from 'react';
import type { SchemaOf } from 'yup';

import { WorkerOnboardingFormValues } from './config';

interface AdditionalInformationFormProps {
  setValidationSchema: Dispatch<SchemaOf<unknown>>;
  workerEmploymentId: string;
}

const AdditionalInformationForm: FC<AdditionalInformationFormProps> = ({
  setValidationSchema,
  workerEmploymentId,
}) => {
  const {
    values: { workerType, citizenshipStatus },
  } = useFormikContext<WorkerOnboardingFormValues>();
  const context = useMemo(() => {
    return {
      type: FileManagementContextType.WORKER_EMPLOYMENT,
      workerEmploymentId,
    };
  }, [workerEmploymentId]);

  useEffect(() => {
    /* istanbul ignore next */
    // this case doesn't necessary to test
    if (!workerType) return;
    (async () => {
      const validationSchema = (
        await import(
          `@components/pages/worker/onboarding/configs/additional-information/${
            citizenshipStatus === CitizenshipStatus.PERMIT_HOLDER
              ? `is-permit-holder`
              : `is-not-permit-holder`
          }/${getWorkerCountryCode(workerType).toLocaleLowerCase()}`
        )
      ).validationSchema;
      setValidationSchema(validationSchema);
    })();
  }, [workerType, citizenshipStatus, setValidationSchema]);

  const form = useMemo(() => {
    /* istanbul ignore next */
    // this case doesn't necessary to test
    if (!workerType) return <></>;

    const Form = dynamic<{ context: FileManagementContext }>(
      () =>
        import(
          `@components/pages/worker/onboarding/additional-information/${
            citizenshipStatus === CitizenshipStatus.PERMIT_HOLDER
              ? `is-permit-holder`
              : `is-not-permit-holder`
          }/${getWorkerCountryCode(workerType).toLocaleLowerCase()}`
        )
    );

    return <Form context={context} />;
  }, [workerType, citizenshipStatus, context]);

  return form;
};

export default AdditionalInformationForm;
