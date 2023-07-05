import { NextPage, UserSession } from '@ayp/typings/commons';
import { CompanyPayroll, CompanyPayrollStatus } from '@ayp/typings/entities';
import { isErrorResponse } from '@ayp/utils';
import { useTheme } from '@mui/material/styles';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  AppLayout,
  BreadCrumbs,
  Loading,
  useConversationBoxRef,
} from '@components/commons';
import {
  AddPayrollFileModal,
  CompanyPayrollIdActions,
  CompanyPayrollIdContentContainer,
  CompanyPayrollIdFiles,
  CompanyPayrollIdTitle,
  PayrollCommentSidebar,
} from '@components/commons/payroll-dashboard/company-payroll-id';
import { Toast } from '@components/ui';
import { RedirectionError } from '@configs/errors';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { COMPANY_PAYROLL_COMPANY_PAYROLL, COMPANY_ROOT } from '@configs/routes';
import { CompanyPayrollApi } from '@services/apis/fintech';

const getCompanyPayroll = async (
  session: UserSession,
  companyPayrollId: string
): Promise<CompanyPayroll> => {
  const { companyPayroll } = await CompanyPayrollApi.getCompanyPayrollById(
    session,
    {
      attributes: [
        'companyPayrollId',
        'countryCode',
        'country:code,name',
        'cycle',
        'type',
        'name',
        'periodStartDate',
        'periodEndDate',
        'status',
        'companyPayrollFiles.fileManagement:id,filePath,createdAt,createdById',
        'companyPayrollFiles.fileManagement.createdBy.user:cognitoId,email,firstName,lastName',
        'conversation',
      ],
    },
    companyPayrollId
  );

  // TODO: remove sort by FE after API corrects sorting
  return {
    ...companyPayroll,
    companyPayrollFiles: companyPayroll.companyPayrollFiles?.sort((a, b) => {
      return a.fileManagement.createdAt <= b.fileManagement.createdAt ? 1 : -1;
    }),
  };
};

interface CompanyPayrollCompanyPayrollIdProps {
  id: string;
}

const CompanyPayrollCompanyPayrollId: NextPage<
  CompanyPayrollCompanyPayrollIdProps
> = ({ isDesktop, session, id }) => {
  const { t } = useTranslation('payroll-company-payroll-id');
  const theme = useTheme();
  const router = useRouter();
  const conversationBoxRef = useConversationBoxRef();

  const [companyPayroll, setCompanyPayroll] =
    useState<Nullable<CompanyPayroll>>(null);
  /* istanbul ignore next */
  // this case doesn't necessary to test
  const activePayrollListUrl = `${COMPANY_PAYROLL_COMPANY_PAYROLL.path}?tab=${
    companyPayroll
      ? companyPayroll.status.includes(CompanyPayrollStatus.PENDING)
        ? CompanyPayrollStatus.PENDING.toLocaleLowerCase()
        : companyPayroll.status.toLocaleLowerCase()
      : CompanyPayrollStatus.DRAFT.toLowerCase()
  }`;
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false);
  const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
  const [toast, setToast] = useState<Toast>({});
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(() => {
    (async () => {
      setLoading(true);
      try {
        const companyPayroll = await getCompanyPayroll(session, id);
        setCompanyPayroll(companyPayroll);
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
        setLoading(false);
      }
    })();
  }, [session, id, t]);

  const onAddFileSuccess = useCallback(
    (hasAddedComment: boolean) => {
      if (hasAddedComment) conversationBoxRef.current?.handleLookup();
      fetchData();
    },
    [conversationBoxRef, fetchData]
  );

  useEffect(() => {
    (async () => {
      fetchData();
    })();
  }, [fetchData]);

  const renderPageContent = useMemo(() => {
    return (
      <CompanyPayrollIdContentContainer
        isDesktop={isDesktop}
        icCommentSidebarOpen={isCommentSidebarOpen}
      >
        <BreadCrumbs
          breadCrumbItems={[
            {
              name: t('backToActivePayrollList'),
              onClick: () => {
                router.push(activePayrollListUrl);
              },
              dataTestId:
                'companyPayroll-companyPayrollId-breadCrumbItems-backToActivePayrollList',
            },
          ]}
          t={t}
        />
        {companyPayroll && (
          <>
            <CompanyPayrollIdTitle
              sx={{
                marginTop: '1rem',
              }}
              t={t}
              countryCode={companyPayroll.countryCode}
              title={`${companyPayroll.country.name} - ${companyPayroll.name}`}
              periodStartDate={companyPayroll.periodStartDate}
              periodEndDate={companyPayroll.periodEndDate}
              payrollStatus={companyPayroll.status}
              dataTestId="companyPayroll-companyPayrollId-title"
            />
            <CompanyPayrollIdActions
              t={t}
              disableDownloadAllFiles={true}
              onClickedAddFile={() => setIsAddFileDialogOpen(true)}
              onClickedComment={() =>
                setIsCommentSidebarOpen((isOpen) => !isOpen)
              }
              dataTestId="companyPayroll-companyPayrollId-actions"
            />
            <CompanyPayrollIdFiles
              isDesktop={isDesktop}
              t={t}
              files={companyPayroll.companyPayrollFiles}
              setToast={setToast}
              fetchData={fetchData}
              dataTestId="companyPayroll-companyPayrollId-files"
            />
          </>
        )}
      </CompanyPayrollIdContentContainer>
    );
  }, [
    activePayrollListUrl,
    companyPayroll,
    router,
    fetchData,
    isCommentSidebarOpen,
    isDesktop,
    t,
  ]);

  return (
    <AppLayout
      isDesktop={isDesktop}
      sx={{
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
        boxShadow: 'none',
        paddingY: 0,
        paddingX: isDesktop ? 0 : '1rem',
      }}
    >
      {loading ? <Loading /> : renderPageContent}
      {isAddFileDialogOpen && (
        <AddPayrollFileModal
          onClose={() => setIsAddFileDialogOpen(false)}
          onSuccess={onAddFileSuccess}
          companyPayrollId={id}
          setToast={setToast}
          dataTestId="companyPayroll-companyPayrollId-addPayrollFileModal"
        />
      )}
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="companyPayroll-companyPayrollId-toast"
      >
        {toast.message}
      </Toast>
      {companyPayroll?.companyPayrollId && isCommentSidebarOpen && (
        <PayrollCommentSidebar
          isDesktop={isDesktop}
          isOpen={isCommentSidebarOpen}
          onClose={() => setIsCommentSidebarOpen(false)}
          companyPayrollId={id}
          conversationId={companyPayroll?.conversation?.conversationId}
          conversationBoxRef={conversationBoxRef}
          dataTestId="companyPayroll-companyPayrollId-payrollCommentSidebar"
        />
      )}
    </AppLayout>
  );
};

export default CompanyPayrollCompanyPayrollId;

export const getServerSideProps: GetServerSideProps<
  CompanyPayrollCompanyPayrollIdProps
> = async (context) => {
  try {
    const { id } = context.query;

    if (typeof id !== 'string')
      return {
        redirect: {
          permanent: false,
          destination: COMPANY_ROOT.path,
        },
      };

    return {
      props: {
        id,
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'add-payroll-file-modal',
          'common',
          'comment-type',
          'conversation',
          'file-upload-status',
          'payroll-company-payroll-id',
          'payroll-status',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as CompanyPayrollCompanyPayrollIdProps,
    };
  }
};
