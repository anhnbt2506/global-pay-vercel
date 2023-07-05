import { EmailTemplates } from '@ayp/typings/commons';
import { Option, CountryOption } from '@ayp/typings/ui';
import * as yup from 'yup';

import {
  EMAILS_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export interface StaffEmailTemplatesFormValues {
  templateName: Nullable<EmailTemplates>;
  subjectPart: string;
  htmlPart: string;
  country?: Nullable<CountryOption>;
  cc?: Option<string>[];
  isCcEnabled?: boolean;
  autoFillTags: string[];
}

export const validationSchema = (template: string) =>
  yup.object().shape({
    subjectPart: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    htmlPart: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    country: yup
      .object()
      .nullable()
      .test({
        message: REQUIRED_FIELD_ERROR_MESSAGE,
        test: (value) => {
          if (template === EmailTemplates.STAFF_ADDENDUM_MANUAL_REQUEST) {
            if (!value) {
              return false;
            }
            return true;
          }
          return true;
        },
      }),
    cc: yup.array().test({
      message: EMAILS_FIELD_ERROR_MESSAGE,
      test: (value) => {
        if (!value) {
          return true;
        }

        return value.every((item: Option<string>) => {
          return item.id && yup.string().email().isValidSync(item.id);
        });
      },
    }),
  });
