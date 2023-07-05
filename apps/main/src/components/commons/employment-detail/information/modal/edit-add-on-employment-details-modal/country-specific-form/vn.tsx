import { Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { addDays } from 'date-fns';

import { TextField, DatePicker } from '@components/ui';

import { WorkerEmploymentFormValues } from '../../../config';

const VnForm: FC = () => {
  const { t } = useTranslation('staff-audit-client-hires-employment-id');

  const {
    values: { probationStartDate },
  } = useFormikContext<WorkerEmploymentFormValues>();

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <DatePicker
            required
            defaultValue={null}
            disableHighlightToday
            name="probationStartDate"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.vn.probationStartDate.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.vn.probationStartDate.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.probationStartDate"
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            required
            defaultValue={null}
            disableHighlightToday
            name="probationEndDate"
            minDate={
              /* istanbul ignore next */
              // this case doesn't necessary to test
              probationStartDate ? addDays(probationStartDate as Date, 1) : null
            }
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.vn.probationEndDate.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.vn.probationEndDate.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.probationEndDate"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.socialInsuranceBookNo"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.vn.socialInsuranceBookNo.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.vn.socialInsuranceBookNo.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.socialInsuranceBookNo"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.localHospitalForStatutoryMedicalInsurance"
            label={t(
              'informationForm.editModals.addOnEmploymentDetails.vn.localHospitalForStatutoryMedicalInsurance.label'
            )}
            helperText={t(
              'informationForm.editModals.addOnEmploymentDetails.vn.localHospitalForStatutoryMedicalInsurance.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.addOnEmploymentDetails.vn.fields.localHospitalForStatutoryMedicalInsurance"
          />
        </Grid>
      </Grid>
    ),
    [t, probationStartDate]
  );
  return form;
};

export default VnForm;
