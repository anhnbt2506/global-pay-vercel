import { Option } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useMemo } from 'react';

import { Autocomplete, TextField, Toast } from '@components/ui';

import { WorkerEmploymentFormValues } from '../../config';
import { EditModal } from '../commons';
import { mapToRequestBody, validationSchema } from './config';

interface EditBankDetailsModalProps {
  initialValues: WorkerEmploymentFormValues;
  bankOptions: Option<string>[];
  setToast: Dispatch<SetStateAction<Toast>>;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
}

const EditBankDetailsModal: FC<EditBankDetailsModalProps> = ({
  onCloseModal,
  onSuccess,
  setToast,
  initialValues,
  bankOptions,
}) => {
  const { t } = useTranslation('staff-audit-client-hires-employment-id');

  const bankDetailsForm = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <TextField
            required
            name="workerUser.bankAccount.beneficiaryName"
            label={t(
              'informationForm.editModals.bankDetails.form.bankAccount.beneficiaryName.label'
            )}
            helperText={t(
              'informationForm.editModals.bankDetails.form.bankAccount.beneficiaryName.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.bankDetails.fields.beneficiaryName"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerUser.bankAccount.accountNumber"
            label={t(
              'informationForm.editModals.bankDetails.form.bankAccount.accountNumber.label'
            )}
            helperText={t(
              'informationForm.editModals.bankDetails.form.bankAccount.accountNumber.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.bankDetails.fields.accountNumber"
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            required
            name="workerUser.bankAccount.bank"
            options={bankOptions}
            label={t(
              'informationForm.editModals.bankDetails.form.bankAccount.bank.label'
            )}
            helperText={t(
              'informationForm.editModals.bankDetails.form.bankAccount.bank.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.bankDetails.fields.bank"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerUser.bankAccount.branchCode"
            label={t(
              'informationForm.editModals.bankDetails.form.bankAccount.branchCode.label'
            )}
            helperText={t(
              'informationForm.editModals.bankDetails.form.bankAccount.branchCode.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.bankDetails.fields.branchCode"
          />
        </Grid>
      </Grid>
    ),
    [t, bankOptions]
  );

  return (
    <EditModal
      formFields={bankDetailsForm}
      initialValues={initialValues}
      validationSchema={validationSchema}
      mapToRequestBody={mapToRequestBody}
      onCloseModal={onCloseModal}
      onSuccess={onSuccess}
      setToast={setToast}
      modalTitle={t('informationForm.editModals.bankDetails.title')}
    />
  );
};

export default EditBankDetailsModal;
