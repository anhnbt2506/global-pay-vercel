import { FileManagementContextType, UserSession } from '@ayp/typings/commons';
import { Option } from '@ayp/typings/ui';
import { useFormikContext } from 'formik';
import memoizee from 'memoizee';
import { TFunction } from 'next-i18next';
import { FC, useEffect, useMemo, useState } from 'react';

import { StaffAuditClientHiresFormValues } from '@components/pages/staff/audit/client-hires/config';
import { Autocomplete, FileUpload, Select } from '@components/ui';
import { HIRE_TYPE_OPTIONS } from '@configs/constants';
import { CompanyApi } from '@services/apis/people';

const getCompanyListMemo = memoizee(
  async (session: UserSession): Promise<Option[]> => {
    const { companies } = await CompanyApi.listAll(session);

    return companies.map((company) => ({
      id: company.companyId,
      label: `[${company.companyId}] ${company.name}`,
    }));
  },
  { promise: true }
);

export const AddNewHireFormFields: FC<{
  t: TFunction;
  session: UserSession;
}> = ({ t, session }) => {
  const {
    values: { company, hireType },
  } = useFormikContext<StaffAuditClientHiresFormValues>();
  const [companies, setCompanies] = useState<Option[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCompanyListMemo(session);
      setCompanies(data);
    };
    fetch();
  }, [session]);

  const hireTypeOptions = useMemo(
    () =>
      HIRE_TYPE_OPTIONS.map((hireType) => ({
        ...hireType,
        label: t(hireType.label),
      })),
    [t]
  );
  return (
    <>
      <Select
        required
        name="hireType"
        options={hireTypeOptions}
        label={t('addNewHire.form.hireType.label')}
        helperText={t('addNewHire.form.hireType.helperText')}
        dataTestId="staffClientHires-addNewHire-hireType"
      />
      <Autocomplete
        required
        name="company"
        options={companies}
        label={t('addNewHire.form.company.label')}
        helperText={t('addNewHire.form.company.helperText')}
        dataTestId="staffClientHires-addNewHire-company"
      />
      {!!hireType && (
        <FileUpload
          required
          name="csvBulkUpload"
          maxFileSizeInMb={10}
          allowedFileType={['.csv']}
          label={t('addNewHire.form.csvBulkUpload.label')}
          context={{
            type: FileManagementContextType.WORKER_EMPLOYMENT_CSV,
            hireType: hireType,
            companyId: company?.id,
          }}
          dataTestId="staffClientHires-addNewHire-csvBulkUpload"
        />
      )}
    </>
  );
};
