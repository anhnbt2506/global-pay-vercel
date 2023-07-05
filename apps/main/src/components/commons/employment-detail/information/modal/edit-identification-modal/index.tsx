import { Grid } from '@mui/material';
import { TFunction, useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { CountryCode } from '@ayp/typings/commons';
import { useFormikContext } from 'formik';
import { CitizenshipStatus, PermitType } from '@ayp/typings/entities';

import { DatePicker, Select, TextField, Toast } from '@components/ui';
import {
  CITIZENSHIP_STATUS_OPTIONS,
  PERMIT_TYPE_OPTIONS,
} from '@configs/constants';

import { WorkerEmploymentFormValues } from '../../config';
import { EditModal } from '../commons';
import { mapToRequestBody, validationSchema } from './config';

interface IdentificationFormProps {
  t: TFunction;
  countryCode: string;
}

const IdentificationForm: React.FC<IdentificationFormProps> = ({
  t,
  countryCode,
}) => {
  const {
    values: { citizenshipStatus },
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<WorkerEmploymentFormValues>();

  useEffect(() => {
    /* istanbul ignore next */
    // this case can't be tested until cypress can input DatePicker
    if (citizenshipStatus !== CitizenshipStatus.PERMIT_HOLDER) {
      setFieldValue('workerIdentity.permitType', null);
      setFieldValue('workerIdentity.permitId', null);
      setFieldValue('workerIdentity.permitIssuedDate', null);
      setFieldValue('workerIdentity.permitIssuedPlace', null);
      setFieldValue('workerIdentity.permitIssuedPlaceAlternate', null);
      setFieldValue('additionalInfo.oldPermitId', null);

      setFieldTouched('workerIdentity.permitType', false);
      setFieldTouched('workerIdentity.permitId', false);
      setFieldTouched('workerIdentity.permitIssuedDate', false);
      setFieldTouched('workerIdentity.permitIssuedPlace', false);
      setFieldTouched('workerIdentity.permitIssuedPlaceAlternate', false);
      setFieldTouched('workerIdentity.oldPermitId', false);
    }
  }, [citizenshipStatus, setFieldValue, setFieldTouched]);

  const citizenshipStatusOptions = useMemo(
    () =>
      CITIZENSHIP_STATUS_OPTIONS.map((hireType) => ({
        ...hireType,
        label: t(hireType.label),
      })),
    [t]
  );

  const permitTypeOptions = useMemo(
    () =>
      PERMIT_TYPE_OPTIONS.filter(({ id }) => id !== PermitType.NA).map(
        (permitType) => ({
          ...permitType,
          label: t(permitType.label),
        })
      ),
    [t]
  );

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <TextField
            required
            name="workerUser.userContext.user.email"
            label={t(
              'informationForm.editModals.identification.form.workerUser.userContext.user.email.label'
            )}
            helperText={t(
              'informationForm.editModals.identification.form.workerUser.userContext.user.email.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.userContext.identification.fields.email"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="citizenshipStatus"
            options={citizenshipStatusOptions}
            label={t(
              'informationForm.editModals.identification.form.citizenshipStatus.label'
            )}
            helperText={t(
              'informationForm.editModals.identification.form.citizenshipStatus.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.citizenshipStatus"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerIdentity.taxId"
            label={t(
              'informationForm.editModals.identification.form.workerIdentity.taxId.label'
            )}
            helperText={t(
              'informationForm.editModals.identification.form.workerIdentity.taxId.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.taxId"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerIdentity.nationalId"
            label={t(
              'informationForm.editModals.identification.form.workerIdentity.nationalId.label'
            )}
            helperText={t(
              'informationForm.editModals.identification.form.workerIdentity.nationalId.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.nationalId"
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            required
            name="workerIdentity.nationalIdIssuedDate"
            label={t(
              'informationForm.editModals.identification.form.workerIdentity.nationalIdIssuedDate.label'
            )}
            helperText={t(
              'informationForm.editModals.identification.form.workerIdentity.nationalIdIssuedDate.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.nationalIdIssuedDate"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerIdentity.nationalIdIssuedPlace"
            label={t(
              'informationForm.editModals.identification.form.workerIdentity.nationalIdIssuedPlace.label'
            )}
            helperText={t(
              'informationForm.editModals.identification.form.workerIdentity.nationalIdIssuedPlace.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.nationalIdIssuedPlace"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerIdentity.nationalIdIssuedPlaceAlternate"
            label={t(
              'informationForm.editModals.identification.form.workerIdentity.nationalIdIssuedPlaceAlternate.label'
            )}
            helperText={t(
              'informationForm.editModals.identification.form.workerIdentity.nationalIdIssuedPlaceAlternate.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.nationalIdIssuedPlaceAlternate"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerIdentity.passportNumber"
            label={t(
              'informationForm.editModals.identification.form.workerIdentity.passportNumber.label'
            )}
            helperText={t(
              'informationForm.editModals.identification.form.workerIdentity.passportNumber.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.passportNumber"
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            required
            name="workerIdentity.passportIssuedDate"
            label={t(
              'informationForm.editModals.identification.form.workerIdentity.passportIssuedDate.label'
            )}
            helperText={t(
              'informationForm.editModals.identification.form.workerIdentity.passportIssuedDate.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.passportIssuedDate"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerIdentity.passportIssuedPlace"
            label={t(
              'informationForm.editModals.identification.form.workerIdentity.passportIssuedPlace.label'
            )}
            helperText={t(
              'informationForm.editModals.identification.form.workerIdentity.passportIssuedPlace.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.passportIssuedPlace"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerIdentity.passportIssuedPlaceAlternate"
            label={t(
              'informationForm.editModals.identification.form.workerIdentity.passportIssuedPlaceAlternate.label'
            )}
            helperText={t(
              'informationForm.editModals.identification.form.workerIdentity.passportIssuedPlaceAlternate.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.passportIssuedPlaceAlternate"
          />
        </Grid>
        {citizenshipStatus === CitizenshipStatus.PERMIT_HOLDER && (
          <>
            <Grid item xs={12}>
              <Select
                required
                name="workerIdentity.permitType"
                options={permitTypeOptions}
                label={t(
                  'informationForm.editModals.identification.form.workerIdentity.permitType.label'
                )}
                helperText={t(
                  'informationForm.editModals.identification.form.workerIdentity.permitType.helperText'
                )}
                dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.permitType"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="workerIdentity.permitId"
                label={t(
                  'informationForm.editModals.identification.form.workerIdentity.permitId.label'
                )}
                helperText={t(
                  'informationForm.editModals.identification.form.workerIdentity.permitId.helperText'
                )}
                dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.permitId"
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                required
                name="workerIdentity.permitIssuedDate"
                label={t(
                  'informationForm.editModals.identification.form.workerIdentity.permitIssuedDate.label'
                )}
                helperText={t(
                  'informationForm.editModals.identification.form.workerIdentity.permitIssuedDate.helperText'
                )}
                dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.permitIssuedDate"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="workerIdentity.permitIssuedPlace"
                label={t(
                  'informationForm.editModals.identification.form.workerIdentity.permitIssuedPlace.label'
                )}
                helperText={t(
                  'informationForm.editModals.identification.form.workerIdentity.permitIssuedPlace.helperText'
                )}
                dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.permitIssuedPlace"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="workerIdentity.permitIssuedPlaceAlternate"
                label={t(
                  'informationForm.editModals.identification.form.workerIdentity.permitIssuedPlaceAlternate.label'
                )}
                helperText={t(
                  'informationForm.editModals.identification.form.workerIdentity.permitIssuedPlaceAlternate.helperText'
                )}
                dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.permitIssuedPlaceAlternate"
              />
            </Grid>
            {countryCode === CountryCode.VIETNAM && (
              <Grid item xs={12}>
                <TextField
                  name="additionalInfo.oldPermitId"
                  label={t(
                    'informationForm.editModals.identification.form.additionalInfo.oldPermitId.label'
                  )}
                  helperText={t(
                    'informationForm.editModals.identification.form.additionalInfo.oldPermitId.helperText'
                  )}
                  dataTestId="staffAuditClientHires-employmentId-editInformation.identification.fields.oldPermitId"
                />
              </Grid>
            )}
          </>
        )}
      </Grid>
    ),
    [
      t,
      citizenshipStatusOptions,
      permitTypeOptions,
      countryCode,
      citizenshipStatus,
    ]
  );

  return form;
};

interface EditPersonalProfileProps {
  initialValues: WorkerEmploymentFormValues;
  countryCode: string;
  setToast: Dispatch<SetStateAction<Toast>>;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
}

const EditIdentification: FC<EditPersonalProfileProps> = ({
  onCloseModal,
  onSuccess,
  setToast,
  countryCode,
  initialValues,
}) => {
  const { t } = useTranslation('staff-audit-client-hires-employment-id');

  return (
    <EditModal
      formFields={<IdentificationForm t={t} countryCode={countryCode} />}
      initialValues={initialValues}
      validationSchema={validationSchema}
      mapToRequestBody={mapToRequestBody}
      onCloseModal={onCloseModal}
      onSuccess={onSuccess}
      setToast={setToast}
      modalTitle={t('informationForm.editModals.identification.title')}
    />
  );
};

export default EditIdentification;
