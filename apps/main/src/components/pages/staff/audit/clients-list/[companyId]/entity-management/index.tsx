import {
  Company,
  CompanyLinking,
  EntityLinking,
  EntityLinkStatus,
} from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { Box } from '@mui/material';
import { TFunction } from 'i18next';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';

import { Toast } from '@components/ui';
import { useSessionCookies } from '@hooks';
import { CompanyApi } from '@services/apis/people';

import EntityButton from './entity-button';
import { LinkEntityModal } from './modals/link-entity-modal';
import { UnlinkEntityModal } from './modals/unlink-entity-modal';

interface EntityManagementProps {
  t: TFunction;
  company: Company;
  countries: CountryOption[];
}

const EntityManagement: FC<EntityManagementProps> = ({
  t,
  company,
  countries,
}) => {
  const { session } = useSessionCookies();
  const [companyEntityLink, setCompanyEntityLink] = useState<EntityLinking>();
  const [toast, setToast] = useState<Toast>({});
  const [selectedCompanyUnlink, setSelectedCompanyUnlink] =
    useState<Nullable<CompanyLinking>>(null);
  const [isDisplayLinkEntityModal, setIsDisplayLinkEntityModal] =
    useState(false);

  const getEntityLinking = useCallback(async () => {
    const res = await CompanyApi.getEntityLinking(session, company.companyId);
    setCompanyEntityLink(res.companyEntityLink);
  }, [session, company.companyId]);

  useEffect(() => {
    (async () => {
      getEntityLinking();
    })();
  }, [getEntityLinking]);

  const onHandleUnlinkClick = (companyLinking: CompanyLinking) => {
    setSelectedCompanyUnlink(companyLinking);
  };

  const handleDisplayEntityLinking = () => {
    if (!companyEntityLink) return null;
    switch (companyEntityLink.entityLinkStatus) {
      case EntityLinkStatus.STANDALONE:
        return (
          <EntityButton
            t={t}
            buttonType={EntityLinkStatus.STANDALONE}
            onCloseModal={onCloseLinkEntityModal}
            onOpenModal={onOpenLinkEntityModal}
          />
        );
      case EntityLinkStatus.PARENT:
        return (
          <Fragment>
            <EntityButton
              t={t}
              buttonType={EntityLinkStatus.STANDALONE}
              onCloseModal={onCloseLinkEntityModal}
              onOpenModal={onOpenLinkEntityModal}
            />
            {companyEntityLink.subsidiaryCompanies &&
              mapSubsidiary(companyEntityLink.subsidiaryCompanies)}
          </Fragment>
        );
      case EntityLinkStatus.SUBSIDIARY:
        return (
          <EntityButton
            t={t}
            buttonType={EntityLinkStatus.PARENT}
            companyLinking={companyEntityLink.parentCompany}
            onHandleUnlinkClick={onHandleUnlinkClick}
          />
        );
      /* istanbul ignore next */
      // this case doesn't necessary to test
      default:
        return <></>;
    }
  };

  const mapSubsidiary = (subsidaries: CompanyLinking[]) => {
    /* istanbul ignore next */
    if (!subsidaries) return null;
    return subsidaries.map((subsidary) => {
      return (
        <Fragment key={subsidary.companyId}>
          <EntityButton
            t={t}
            buttonType={EntityLinkStatus.SUBSIDIARY}
            companyLinking={subsidary}
            onHandleUnlinkClick={onHandleUnlinkClick}
          />
        </Fragment>
      );
    });
  };

  const onCloseLinkEntityModal = () => {
    setIsDisplayLinkEntityModal(false);
  };

  const onOpenLinkEntityModal = () => {
    setIsDisplayLinkEntityModal(true);
  };

  return (
    <>
      {isDisplayLinkEntityModal && (
        <LinkEntityModal
          t={t}
          companyId={company.companyId}
          countries={countries}
          entityLinkStatus={
            companyEntityLink?.entityLinkStatus ?? EntityLinkStatus.STANDALONE
          }
          onCloseModal={onCloseLinkEntityModal}
          onSuccess={getEntityLinking}
          setToast={setToast}
        />
      )}
      {selectedCompanyUnlink && (
        <UnlinkEntityModal
          companyId={company.companyId}
          linkedCompanyId={selectedCompanyUnlink.companyId}
          onCloseModal={() => setSelectedCompanyUnlink(null)}
          onSuccess={getEntityLinking}
          setToast={setToast}
        />
      )}
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffAudit-clientList-entityManagement-toast"
      >
        {toast.message}
      </Toast>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem',
        }}
      >
        {handleDisplayEntityLinking()}
      </Box>
    </>
  );
};

export default EntityManagement;
