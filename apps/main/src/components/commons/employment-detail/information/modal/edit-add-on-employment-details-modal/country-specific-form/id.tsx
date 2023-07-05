import { Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { CountryCode } from '@ayp/typings/commons';

import { NumberField } from '@components/ui';
import {
  CALENDAR_UNIT_LABEL_PREFIX,
  HIRING_COUNTRY_RULES,
} from '@configs/constants';
import { VALUE_BETWEEN_MIN_AND_MAX_HELPER_TEXT } from '@configs/forms';

import { WorkerEmploymentFormValues } from '../../../config';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.INDONESIA];

const IdForm: FC = ({}) => {
  const { t } = useTranslation('staff-audit-client-hires-employment-id');

  const {
    values: { currency },
  } = useFormikContext<WorkerEmploymentFormValues>();

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <NumberField
            required
            defaultValue=""
            name="probationPeriod"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.id.probationPeriod.label',
              {
                unit: t(
                  `${CALENDAR_UNIT_LABEL_PREFIX}${hiringCountryRule.probationPeriod.unit}`
                ),
              }
            )}
            helperText={t(VALUE_BETWEEN_MIN_AND_MAX_HELPER_TEXT, {
              min: hiringCountryRule.probationPeriod.min,
              max: hiringCountryRule.probationPeriod.max,
            })}
            numberFormatProps={{
              decimalScale: 0,
              allowNegative: false,
              thousandSeparator: true,
            }}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.id.fields.probationPeriod"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberField
            required
            name="additionalInfo.religiousFestivityAllowance"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.id.religiousFestivityAllowance.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.id.religiousFestivityAllowance.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.id.fields.religiousFestivityAllowance"
            startAdornment={currency}
            numberFormatProps={{
              decimalScale: 2,
              allowNegative: false,
              fixedDecimalScale: true,
              thousandSeparator: true,
            }}
          />
        </Grid>
      </Grid>
    ),
    [t, currency]
  );

  return form;
};

export default IdForm;
