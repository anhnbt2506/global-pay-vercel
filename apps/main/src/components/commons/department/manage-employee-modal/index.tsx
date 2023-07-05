import { ErrorCode, UserSession } from '@ayp/typings/commons';
import { Department, WorkerEmployment } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';

import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { DepartmentApi, WorkerEmploymentApi } from '@services/apis/people';
import { Form, Formik, FormikHelpers } from 'formik';
import { TFunction } from 'i18next';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Autocomplete, ButtonSubmit, Toast } from '@components/ui';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';

import {
  AddEmployeeFormValues,
  mapToRequestBody,
  validationSchema,
} from './config';

interface EmployeeManagementProps {
  t: TFunction;
  session: UserSession;
  departmentId: string;
  companyId: string;
  assignedEmployeeOptions: Option<string>[];
  onSuccess: (value?: Department) => void;
  onClose: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
}

const EmployeeManagement: FC<EmployeeManagementProps> = ({
  t,
  session,
  departmentId,
  companyId,
  assignedEmployeeOptions,
  onSuccess,
  setToast,
  onClose,
}) => {
  const [employeeOptions, setEmployeeOptions] = useState<Option<string>[]>([]);

  const fetchUnassignedEmployees = useCallback(
    async (
      session: UserSession,
      companyId: string
    ): Promise<WorkerEmployment[]> => {
      const { workerEmployments } =
        await WorkerEmploymentApi.getUnassignedEmployees(session, companyId);
      return workerEmployments;
    },
    []
  );

  useEffect(() => {
    (async () => {
      const unassignedEmployees = await fetchUnassignedEmployees(
        session,
        companyId
      );
      const options = unassignedEmployees.map<Option<string>>(
        ({
          employmentId,
          workerUser: {
            userContext: {
              user: { firstName, lastName, email },
            },
          },
        }) => ({
          label: `${firstName} ${lastName}`,
          email,
          id: employmentId,
        })
      );
      options.push(...assignedEmployeeOptions);
      options.sort((a, b) => a.label.localeCompare(b.label));

      setEmployeeOptions(options);
    })();
  }, [
    companyId,
    session,
    t,
    departmentId,
    assignedEmployeeOptions,
    fetchUnassignedEmployees,
    onSuccess,
  ]);

  const onSubmit = useCallback(
    async (
      values: AddEmployeeFormValues,
      actions: FormikHelpers<AddEmployeeFormValues>
    ) => {
      try {
        await DepartmentApi.updateEmployee(
          session,
          departmentId,
          mapToRequestBody(values)
        );
        onSuccess();
        setToast({
          severity: 'success',
          message: t('common:savedSuccessfully'),
        } as Toast);
      } catch (e) {
        if (isErrorResponse(e)) {
          switch (e.error.code) {
            case ErrorCode.UNPROCESSABLE:
              actions.setErrors({
                assignedEmployeeOptions: t(
                  'company-department:departmentModal.form.addEmployee.error.employeeAlReadyBelongsToOtherDepartment'
                ),
              });
              break;
            default:
              onClose();
              setToast({
                severity: 'error',
                message: e.error.name,
              });
          }
        } else {
          onClose();
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
        }
      }
    },
    [session, departmentId, onSuccess, setToast, t, onClose]
  );

  const filterOptions = useCallback(
    (options: Option<string | number>[], { inputValue } = { inputValue: '' }) =>
      options.filter(
        (option) =>
          (option.email as string)
            .toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          (option.label as string)
            .toLowerCase()
            .includes(inputValue.toLowerCase())
      ),
    []
  );

  return (
    <Dialog open fullWidth maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          paddingX: '2rem',
          paddingTop: '2rem',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          data-testid="staffAuditClientList-companyId-departmentModal-title"
        >
          {t('company-department:departmentModal.manageEmployees.title')}
        </Typography>
        <Typography variant="subtitle1" align="center">
          {t('company-department:departmentModal.manageEmployees.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={{
            assignedEmployeeOptions: assignedEmployeeOptions,
          }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form noValidate>
            <Autocomplete
              name="assignedEmployeeOptions"
              isMultipleOption
              options={employeeOptions}
              filterOptions={filterOptions}
              filterSelectedOptions
              label={t(
                'company-department:departmentModal.form.addEmployee.label'
              )}
              helperText={t(
                'company-department:departmentModal.form.addEmployee.helperText'
              )}
              dataTestId="staffAuditClientList-companyId-departmentModal-assignedEmployeeOptions"
            />
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
                data-testid="staffAuditClientList-companyId-departmentModal-cancelButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffAuditClientList-companyId-departmentModal-submitButton"
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

export default EmployeeManagement;
