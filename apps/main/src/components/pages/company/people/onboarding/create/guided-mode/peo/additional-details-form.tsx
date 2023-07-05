import dynamic from 'next/dynamic';
import type { SchemaOf } from 'yup';
import { useFormikContext } from 'formik';
import { Dispatch, FC, useEffect, useMemo } from 'react';

import { GuidedModePeoFormValues } from './config';

interface AdditionalDetailsFormProps {
  setValidationSchema: Dispatch<SchemaOf<unknown> | undefined>;
}

const AdditionalDetailsForm: FC<AdditionalDetailsFormProps> = ({
  setValidationSchema,
}) => {
  const {
    values: { hiringCountry, additionalDetails },
    setFieldValue,
  } = useFormikContext<GuidedModePeoFormValues>();

  useEffect(() => {
    if (
      hiringCountry &&
      additionalDetails.hiringCountryCode !== hiringCountry.code
    ) {
      setFieldValue('additionalDetails.hiringCountryCode', hiringCountry.code);
    }
  }, [hiringCountry, additionalDetails.hiringCountryCode, setFieldValue]);

  useEffect(() => {
    (async () => {
      /* istanbul ignore else */
      // This case cannot reproduce
      if (hiringCountry) {
        let validationSchema: SchemaOf<unknown> | undefined = undefined;

        try {
          validationSchema = (
            await import(
              `@components/pages/company/people/onboarding/create/guided-mode/peo/additional-details/configs/${hiringCountry.code.toLocaleLowerCase()}`
            )
          ).validationSchema;
        } catch (e) {
          /* istanbul ignore next */
          // This case cannot reproduce
          console.log(e);
        } finally {
          setValidationSchema(validationSchema);
        }
      }
    })();
  }, [hiringCountry, setValidationSchema]);

  const form = useMemo(() => {
    if (!hiringCountry) return <></>;

    const Form = dynamic(
      () =>
        import(
          `@components/pages/company/people/onboarding/create/guided-mode/peo/additional-details/${hiringCountry.code.toLocaleLowerCase()}`
        )
    );

    return <Form />;
  }, [hiringCountry]);

  return form;
};

export default AdditionalDetailsForm;
