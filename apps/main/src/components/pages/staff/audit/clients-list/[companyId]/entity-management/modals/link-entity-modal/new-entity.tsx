import { EntityLinkStatus } from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { Box, Grid } from '@mui/material';
import { TFunction } from 'next-i18next';
import { FC, useMemo } from 'react';

import CreateCompanyAccountForm from '@components/commons/create-company-account-form/create-company-account-form';
import { Select } from '@components/ui';
import { ENTITY_LINK_STATUS_OPTIONS } from '@configs/constants';

interface NewEntityFormProps {
  countries: CountryOption[];
  t: TFunction;
  entityLinkStatus: EntityLinkStatus;
}

export const NewEntityForm: FC<NewEntityFormProps> = ({
  t,
  countries,
  entityLinkStatus,
}) => {
  const entityTypeOptions = useMemo(
    () =>
      ENTITY_LINK_STATUS_OPTIONS.filter((item) => {
        if (entityLinkStatus === EntityLinkStatus.PARENT) {
          return item.id === EntityLinkStatus.SUBSIDIARY;
        } else if (entityLinkStatus === EntityLinkStatus.STANDALONE) {
          return item.id !== EntityLinkStatus.STANDALONE;
        }
      }).map((entityLinkStatus) => ({
        ...entityLinkStatus,
        label: t(entityLinkStatus.label),
      })),
    [entityLinkStatus, t]
  );

  const form = useMemo(
    () => (
      <>
        <Box
          sx={{
            marginBottom: '1rem',
          }}
        >
          <Grid container spacing={2} maxWidth="sm">
            <Grid item xs={12}>
              <Select
                required
                name="linkingType"
                options={entityTypeOptions}
                label={t('linkEntityModal.form.newEntity.entityType.label')}
                helperText={t(
                  'linkEntityModal.form.newEntity.entityType.helperText'
                )}
                dataTestId="staffAudit-clientList-entityManagement-linkEntity-newEntity-linkingType"
              />
            </Grid>
          </Grid>
        </Box>
        <CreateCompanyAccountForm countries={countries} t={t} />
      </>
    ),
    [t, countries, entityTypeOptions]
  );

  return form;
};
