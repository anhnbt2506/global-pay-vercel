import { Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';
import { CountryCode } from '@ayp/typings/commons';

import { NumberField } from '@components/ui';
import {
  CALENDAR_UNIT_LABEL_PREFIX,
  HIRING_COUNTRY_RULES,
} from '@configs/constants';
import { VALUE_BETWEEN_MIN_AND_MAX_HELPER_TEXT } from '@configs/forms';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.SINGAPORE];

const SgForm: FC = () => {
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
              'informationForm.editModals.addOnEmploymentDetails.sg.probationPeriod.label',
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
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.sg.fields.probationPeriod"
          />
        </Grid>
      </Grid>
    ),
    [t]
  );

  return form;
};

export default SgForm;
