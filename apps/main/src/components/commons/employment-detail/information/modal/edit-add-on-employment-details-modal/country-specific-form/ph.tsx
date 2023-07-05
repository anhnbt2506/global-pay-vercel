import { Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { CountryCode } from '@ayp/typings/commons';

import { NumberField, Select, TextField } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  PHILIPPINES_FIELD_MANAGERIAL_TYPE_OPTIONS,
  CALENDAR_UNIT_LABEL_PREFIX,
  HIRING_COUNTRY_RULES,
} from '@configs/constants';
import { VALUE_OF_HELPER_TEXT } from '@configs/forms';

import { WorkerEmploymentFormValues } from '../../../config';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.PHILIPPINES];

const PhForm: FC = () => {
  const { t } = useTranslation('staff-audit-client-hires-employment-id');

  const {
    values: { currency },
  } = useFormikContext<WorkerEmploymentFormValues>();

  const fieldManagerialTypeOptions = useMemo(
    () =>
      PHILIPPINES_FIELD_MANAGERIAL_TYPE_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );
  //todo update localization and datatestid
  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <NumberField
            required
            defaultValue=""
            name="probationPeriod"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.probationPeriod.label',
              {
                unit: t(
                  `${CALENDAR_UNIT_LABEL_PREFIX}${hiringCountryRule.probationPeriod.unit}`
                ),
              }
            )}
            helperText={t(VALUE_OF_HELPER_TEXT, {
              value: hiringCountryRule.probationPeriod.value,
            })}
            numberFormatProps={{
              decimalScale: 0,
              allowNegative: false,
              thousandSeparator: true,
            }}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.probationPeriod"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            defaultValue=""
            name="additionalInfo.fieldManagerialType"
            options={fieldManagerialTypeOptions}
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.fieldManagerialType.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.fieldManagerialType.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.fieldManagerialType"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberField
            required
            name="workerRemuneration.monthlyAllowance"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.monthlyAllowance.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.monthlyAllowance.label'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.monthlyAllowance"
            startAdornment={currency}
            numberFormatProps={{
              decimalScale: 2,
              allowNegative: false,
              fixedDecimalScale: true,
              thousandSeparator: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.sssId"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.sssId.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.sssId.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.sssId"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.tinId"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.tinId.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.tinId.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.tinId"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            defaultValue=""
            name="additionalInfo.isEntitledToOvertimeDifferential"
            options={yesNoOptions}
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.isEntitledToOvertimeDifferential.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.isEntitledToOvertimeDifferential.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.isEntitledToOvertimeDifferential"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.healthId"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.healthId.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.healthId.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.healthId"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.hdmfId"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.hdmfId.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.ph.hdmfId.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.ph.fields.hdmfId"
          />
        </Grid>
      </Grid>
    ),
    [t, currency, yesNoOptions, fieldManagerialTypeOptions]
  );

  return form;
};

export default PhForm;
