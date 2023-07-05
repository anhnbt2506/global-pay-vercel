import { UserSession } from '@ayp/typings/commons';
import { HireStatus } from '@ayp/typings/entities';
import { isErrorResponse } from '@ayp/utils';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { TFunction } from 'next-i18next';
import {
  Dispatch,
  DispatchWithoutAction,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';

import { ButtonSubmit, Select, Toast } from '@components/ui';
import {
  DEFAULT_TIMEOUT,
  HIRE_STATUS_LABEL_PREFIX,
  HIRE_STATUS_OPTIONS,
} from '@configs/constants';
import { WorkerEmploymentApi } from '@services/apis/people';

const UpdateHireStatusModal: FC<{
  t: TFunction;
  session: UserSession;
  status: HireStatus;
  setStatus: Dispatch<SetStateAction<HireStatus>>;
  onClose: DispatchWithoutAction;
  setToast: Dispatch<SetStateAction<Toast>>;
  employmentId: string;
}> = ({ t, status, session, onClose, setToast, employmentId }) => {
  const hireStatusOptions = useMemo(
    () =>
      HIRE_STATUS_OPTIONS.map((hireStatus) => ({
        ...hireStatus,
        value: t(`${HIRE_STATUS_LABEL_PREFIX}${hireStatus.id}`),
        label: t(hireStatus.label),
      })),
    [t]
  );

  const onUpdateHireStatus = useCallback<
    (values: { status: HireStatus }) => void
  >(
    async (values) => {
      try {
        const { status } = values;
        await WorkerEmploymentApi.update(session, employmentId, {
          status,
        });
        setToast({
          severity: 'success',
          message: t('updateClientStatus.toast.updateSuccess'),
        });
        /* istanbul ignore next */
        // this case doesn't necessary to test
        setTimeout(() => {
          window.location.reload();
        }, DEFAULT_TIMEOUT);
      } catch (e) {
        /* istanbul ignore else */
        // this case doesn't necessary to test
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        }
      } finally {
        onClose();
      }
    },
    [employmentId, onClose, session, setToast, t]
  );

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogContent
        sx={{
          padding: '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" align="center" sx={{ marginBottom: '1rem' }}>
            {t('updateClientStatus.modal.title')}
          </Typography>
          <Typography variant="subtitle1">
            {t('updateClientStatus.modal.description')}
          </Typography>
        </Box>
        <Formik
          initialValues={{
            status,
          }}
          onSubmit={onUpdateHireStatus}
        >
          <Form>
            <Grid maxWidth="sm" sx={{ marginTop: '1rem' }}>
              <Grid item xs={12}>
                <Select
                  required
                  name="status"
                  options={hireStatusOptions}
                  label={t('updateClientStatus.modal.form.status.label')}
                  helperText={t(
                    'updateClientStatus.modal.form.status.helperText'
                  )}
                  dataTestId="staffAudit-clientHires-employmentId-updateClientStatus-fields.status"
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                gap: '2rem',
                display: 'flex',
                marginTop: '2rem',
                justifyContent: 'space-around',
              }}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  paddingX: '3rem',
                }}
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffAudit-clientHires-employmentId-updateClientStatus-button-submit"
              >
                {t('common:update')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateHireStatusModal;
