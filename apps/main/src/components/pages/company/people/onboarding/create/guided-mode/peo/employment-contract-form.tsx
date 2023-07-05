import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { Grid, Paper, Typography } from '@mui/material';
import {
  Company,
  HireType,
  Role,
  WorkerAddendumFiles,
} from '@ayp/typings/entities';
import { UserSession } from '@ayp/typings/commons';

import {
  LegalDocument,
  Loading,
  ReferenceDocuments,
} from '@components/commons';
import { Checkbox, Toast } from '@components/ui';
import { AgreementTemplateApi } from '@services/apis/people';
import {
  EOR_CONTRACT_AGREEMENT_TEMPLATE_PREFIX,
  PEO_CONTRACT_AGREEMENT_TEMPLATE_PREFIX,
} from '@configs/constants';
import { isUserPermitted } from '@ayp/utils';

import { GuidedModePeoFormValues, mapToPostRequestBody } from './config';

interface EmploymentContractFormProps {
  company: Company;
  session: UserSession;
  workerAddendumFiles: Nullable<WorkerAddendumFiles[]>;
  setToast: Dispatch<SetStateAction<Toast>>;
}

const EmploymentContractForm: FC<EmploymentContractFormProps> = ({
  company,
  session,
  workerAddendumFiles,
  setToast,
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation('company-people-onboarding-create');
  const { values } = useFormikContext<GuidedModePeoFormValues>();

  const sortWorkerAddendumFiles = useMemo(() => {
    const sortedAddendumFiles = workerAddendumFiles
      ?.map((item) => item.fileManagement)
      .filter(({ createdBy }) =>
        isUserPermitted([Role.GP_STAFF], createdBy?.role)
      )
      .sort((a, b) =>
        a?.createdAt && b?.createdAt
          ? a.createdAt <= b.createdAt
            ? 1
            : -1
          : a?.createdAt
          ? -1
          : b?.createdAt
          ? 1
          : 0
      );

    return sortedAddendumFiles;
  }, [workerAddendumFiles]);

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      const contractAgreementTemplatePrefix =
        values.hireType === HireType.EOR
          ? EOR_CONTRACT_AGREEMENT_TEMPLATE_PREFIX
          : /* istanbul ignore next */
            // This case cannot reproduce
            PEO_CONTRACT_AGREEMENT_TEMPLATE_PREFIX;
      const { agreementTemplate } = await AgreementTemplateApi.getPreviewById(
        session,
        `${contractAgreementTemplatePrefix}${values.hiringCountry?.code.toLowerCase()}`,
        await mapToPostRequestBody(values)
      );
      setContent(agreementTemplate.content);
    };
    fetch();
    setLoading(false);
  }, [t, company, session, values]);

  if (loading)
    return (
      <Loading
        sx={{
          alignItems: 'flex-start',
        }}
      />
    );

  return (
    <Grid container spacing={2} maxWidth="md">
      <Grid item xs={12} lg={!!sortWorkerAddendumFiles?.length ? 8 : 12}>
        <Paper
          sx={{
            height: '50vh',
            overflow: 'auto',
            padding: '2rem',
          }}
        >
          <LegalDocument content={content} />
        </Paper>
      </Grid>
      {!!sortWorkerAddendumFiles?.length && (
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              height: '50vh',
            }}
          >
            <ReferenceDocuments
              session={session}
              workerAddendumFiles={sortWorkerAddendumFiles}
              setToast={setToast}
              dataTestId="companyPeopleOnboardingCreate-referenceDocuments"
            />
          </Paper>
        </Grid>
      )}
      <Grid item container xs={12}>
        <Grid item xs={2} lg={1}>
          <Checkbox
            required
            name="isSigned"
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-isSigned"
          />
        </Grid>
        <Grid item xs={10} lg={11}>
          <Typography variant="subtitle1">
            {t('guidedMode.PEO.employmentContract.form.isSigned.label', {
              name: `${session?.user.firstName} ${session?.user.lastName}`,
              company: company.name,
            })}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EmploymentContractForm;
