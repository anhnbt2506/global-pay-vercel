import { CountryCode, UserSession } from '@ayp/typings/commons';
import { CompanyPayrollStatus } from '@ayp/typings/entities';
import { isErrorResponse } from '@ayp/utils';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Form, Formik } from 'formik';
import { TFunction } from 'i18next';
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react';
import { Trans } from 'react-i18next';

import { ButtonSubmit, CountryFlag, RadioGroup, Toast } from '@components/ui';
import { ACTIVE_PAYROLL_OPTIONS } from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { CompanyPayrollApi } from '@services/apis/fintech';

import { UpdateStatusFormValues, validationSchema } from './config';

interface UpdatePayrollStatusModalProps {
  session: UserSession;
  companyPayrollId: string;
  countryCode: CountryCode;
  title: string;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
  t: TFunction;
  status: CompanyPayrollStatus;
  setToast: Dispatch<SetStateAction<Toast>>;
  dataTestId?: string;
}

export const UpdatePayrollStatusModal: FC<UpdatePayrollStatusModalProps> = ({
  t,
  onClose,
  onSuccess,
  countryCode,
  title,
  session,
  companyPayrollId,
  setToast,
  status,
  dataTestId,
}) => {
  const theme = useTheme();

  const updateStatusPayrollOptions = useMemo(
    () =>
      ACTIVE_PAYROLL_OPTIONS.filter(
        ({ id }) =>
          id !== CompanyPayrollStatus.PENDING &&
          id !== CompanyPayrollStatus.REJECTED
      ).map((statusPayroll) => ({
        ...statusPayroll,
        id: statusPayroll.id as CompanyPayrollStatus,
        label: t(statusPayroll.label) as string,
      })),
    [t]
  );

  const formatStatus = (status: CompanyPayrollStatus | string) =>
    status.toLowerCase().replace('_', ' ');

  const onSubmit = useCallback(
    async (values: UpdateStatusFormValues) => {
      try {
        await CompanyPayrollApi.updateCompanyPayrollStatus(
          session,
          companyPayrollId,
          values.status
        );

        setToast({
          severity: 'success',
          message: (
            <Trans
              i18nKey={`${t('updateStatus.toast.success', {
                payrollName: title,
                status: formatStatus(values.status),
              })}`}
            />
          ),
        });
        onSuccess();
      } catch (e) {
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        } else {
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
        }
      } finally {
        onClose();
      }
    },
    [companyPayrollId, onClose, onSuccess, session, setToast, t, title]
  );
  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogContent
        sx={{
          padding: '2rem',
        }}
      >
        <Formik
          initialValues={{
            status: status,
          }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <Box
              display="flex"
              justifyContent="center"
              marginBottom="1rem"
              sx={{ flexDirection: 'column' }}
            >
              <Typography
                variant="h6"
                textAlign="center"
                fontWeight="bold"
                data-testid={`${dataTestId}-title`}
              >
                {t('updateStatus.title')}
              </Typography>
              <Typography
                variant="subtitle1"
                textAlign="center"
                marginTop={1}
                data-testid={`${dataTestId}-description`}
              >
                {t('updateStatus.description')}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: theme.palette.grey[100],
                padding: '1.3rem 1.5rem',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                }}
              >
                {t('updateStatus.payrollDetails')}
              </Typography>
              <Divider
                sx={{
                  marginY: '1rem',
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                }}
              >
                <Box
                  style={{
                    width: '25%',
                  }}
                >
                  <Typography variant="subtitle1">
                    {t('updateStatus.form.payrollName')}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CountryFlag code={countryCode} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textAlign: 'left',
                      color: (theme) => theme.palette.text.primary,
                    }}
                    ml={1}
                  >
                    {title}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  marginTop: '1rem',
                  display: 'flex',
                }}
              >
                <Box
                  style={{
                    width: '25%',
                  }}
                >
                  <Typography variant="subtitle1">
                    {t('updateStatus.form.status')}
                  </Typography>
                </Box>
                <Box display="flex">
                  <RadioGroup
                    name="status"
                    options={updateStatusPayrollOptions}
                    dataTestId={`${dataTestId}-radioGroup`}
                  />
                </Box>
              </Box>
            </Box>
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
                data-testid={`${dataTestId}-buttonCancel`}
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid={`${dataTestId}-buttonSubmit`}
              >
                {t('common:submit')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
