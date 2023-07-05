import { CountryCode } from '@ayp/typings/commons';
import { Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';

import { NumberField } from '@components/ui';
import {
  CALENDAR_UNIT_LABEL_PREFIX,
  HIRING_COUNTRY_RULES,
} from '@configs/constants';
import { VALUE_MIN_OF_HELPER_TEXT } from '@configs/forms';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.THAILAND];

const ThForm: FC = () => {
  const { t } = useTranslation('staff-audit-client-hires-employment-id');

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <NumberField
            required
            defaultValue=""
            name="probationPeriod"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.th.probationPeriod.label',
              {
                unit: t(
                  `${CALENDAR_UNIT_LABEL_PREFIX}${hiringCountryRule.probationPeriod.unit}`
                ),
              }
            )}
            helperText={t(VALUE_MIN_OF_HELPER_TEXT, {
              min: hiringCountryRule.probationPeriod.min,
            })}
            numberFormatProps={{
              decimalScale: 0,
              allowNegative: false,
              thousandSeparator: true,
            }}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.th.fields.probationPeriod"
          />
        </Grid>
      </Grid>
    ),
    [t]
  );

  return form;
};

export default ThForm;
