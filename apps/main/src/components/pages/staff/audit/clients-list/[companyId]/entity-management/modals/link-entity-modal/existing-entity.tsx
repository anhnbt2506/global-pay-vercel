import { EntityLinkStatus } from '@ayp/typings/entities';
import { Grid } from '@mui/material';
import { TFunction } from 'next-i18next';
import { FC, useMemo } from 'react';

import { Select, TextField } from '@components/ui';
import { ENTITY_LINK_STATUS_OPTIONS } from '@configs/constants';

interface ExistingEntityFormProps {
  t: TFunction;
  entityLinkStatus: EntityLinkStatus;
}

export const ExistingEntityForm: FC<ExistingEntityFormProps> = ({
  t,
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
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <TextField
            required
            name="linkingCompanyId"
            label={t('linkEntityModal.form.existingEntity.linkId.label')}
            helperText={t(
              'linkEntityModal.form.existingEntity.linkId.helperText'
            )}
            dataTestId="staffAudit-clientList-entityManagement-linkEntity-existingEntity-linkingCompanyId"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="linkingType"
            options={entityTypeOptions}
            label={t('linkEntityModal.form.existingEntity.entityType.label')}
            helperText={t(
              'linkEntityModal.form.existingEntity.entityType.helperText'
            )}
            dataTestId="staffAudit-clientList-entityManagement-linkEntity-existingEntity-linkingType"
          />
        </Grid>
      </Grid>
    ),
    [entityTypeOptions, t]
  );
  return form;
};
