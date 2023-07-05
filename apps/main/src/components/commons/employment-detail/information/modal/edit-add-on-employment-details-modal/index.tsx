import { useTranslation } from 'next-i18next';
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { SchemaOf } from 'yup';

import { Toast } from '@components/ui';

import { WorkerEmploymentFormValues } from '../../config';
import { EditModal } from '../commons';
import { mapToRequestBody } from './config';

interface EditAddOnEmploymentDetailsProps {
  initialValues: WorkerEmploymentFormValues;
  countryCode: string;
  setToast: Dispatch<SetStateAction<Toast>>;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
}

const EditAddOnEmploymentDetailsModal: FC<EditAddOnEmploymentDetailsProps> = ({
  countryCode,
  initialValues,
  onCloseModal,
  onSuccess,
  setToast,
}) => {
  const { t } = useTranslation('staff-audit-client-hires-employment-id');
  const [validationSchema, setValidationSchema] = useState<
    SchemaOf<unknown> | undefined
  >(undefined);

  const form = useMemo(() => {
    /* istanbul ignore next */
    // this case doesn't necessary to test
    if (!countryCode) return <></>;

    const Form = dynamic(
      () => import(`./country-specific-form/${countryCode.toLocaleLowerCase()}`)
    );

    return <Form />;
  }, [countryCode]);

  useEffect(() => {
    (async () => {
      /* istanbul ignore next */
      // this case doesn't necessary to test
      if (!countryCode) return;

      let validationSchema: SchemaOf<unknown> | undefined = undefined;

      try {
        validationSchema = (
          await import(
            `./country-specific-form/config/${countryCode.toLocaleLowerCase()}`
          )
        ).validationSchema;
      } catch (e) {
        /* istanbul ignore next */
        // this case doesn't necessary to test
        console.error(e);
      } finally {
        setValidationSchema(validationSchema);
      }
    })();
  }, [countryCode]);

  return (
    <EditModal
      formFields={form}
      initialValues={initialValues}
      validationSchema={validationSchema}
      mapToRequestBody={(state) => mapToRequestBody(state, countryCode)}
      onCloseModal={onCloseModal}
      onSuccess={onSuccess}
      setToast={setToast}
      modalTitle={t('informationForm.editModals.addOnEmploymentDetails.title')}
    />
  );
};

export default EditAddOnEmploymentDetailsModal;
