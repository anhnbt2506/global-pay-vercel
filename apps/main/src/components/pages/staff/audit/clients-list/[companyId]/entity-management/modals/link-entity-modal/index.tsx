import {
  CompanyCategory,
  EntityLinkOptionsType,
  EntityLinkStatus,
} from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { TFunction } from 'i18next';
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';

import { ButtonSubmit, Select, Toast } from '@components/ui';
import { ENTITY_LINK_OPTIONS } from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { useSessionCookies } from '@hooks';
import { CompanyApi } from '@services/apis/people';

import {
  initialExistingEntityFormValues,
  initialLinkEntityBaseFormValues,
  initialNewEntityFormValues,
  LinkEntityFormValues,
  LinkEntityModalErrorMessages,
  LinkExistingEntityFormValues,
  LinkNewEntityFormValues,
  validationBaseLinkEntitySchema,
  validationExistingEntitySchema,
  validationNewEntitySchema,
} from './config';
import { ExistingEntityForm } from './existing-entity';
import { NewEntityForm } from './new-entity';

interface LinkEntityModalProps {
  t: TFunction;
  companyId: string;
  countries: CountryOption[];
  entityLinkStatus: EntityLinkStatus;
  onSuccess?: () => void;
  onCloseModal?: () => void;
  setToast: Dispatch<SetStateAction<Toast>>;
}

export const LinkEntityModal: FC<LinkEntityModalProps> = ({
  t,
  companyId,
  countries,
  entityLinkStatus,
  onCloseModal,
  onSuccess,
  setToast,
}) => {
  const { session } = useSessionCookies();
  const [linkEntityTypeSelected, setLinkEntityTypeSelected] =
    useState<Nullable<EntityLinkOptionsType>>(null);

  const entityLinkOptions = useMemo(
    () =>
      ENTITY_LINK_OPTIONS.map((entityOptions) => ({
        ...entityOptions,
        label: t(entityOptions.label),
      })),
    [t]
  );

  const linkEntityForm = useMemo(() => {
    switch (linkEntityTypeSelected) {
      case EntityLinkOptionsType.NEW_ENTITY:
        return (
          <NewEntityForm
            t={t}
            countries={countries}
            entityLinkStatus={entityLinkStatus}
          />
        );
      case EntityLinkOptionsType.EXISTING_ENTITY:
        return <ExistingEntityForm t={t} entityLinkStatus={entityLinkStatus} />;
      default:
        return <></>;
    }
  }, [linkEntityTypeSelected, t, countries, entityLinkStatus]);

  const onSubmit = async (
    values: LinkEntityFormValues,
    actions: FormikHelpers<LinkEntityFormValues>
  ) => {
    if (linkEntityTypeSelected === EntityLinkOptionsType.EXISTING_ENTITY) {
      try {
        const { linkingCompanyId, linkingType } =
          values as LinkExistingEntityFormValues;
        await CompanyApi.linkExistingEntity(session, companyId, {
          linkingCompanyId,
          linkingType,
        });
        setToast({
          severity: 'success',
          message: t('linkEntityModal.notify.linkEntitySuccess'),
        });
        onSuccess && onSuccess();
        onCloseModal && onCloseModal();
      } catch (e) {
        if (isErrorResponse(e)) {
          getLinkEntityModalErrorMessages(
            e.error.name,
            actions,
            'linkingCompanyId'
          );
        } else {
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
        }
      }
    } else {
      try {
        const {
          firstName,
          lastName,
          companyName,
          jobTitle,
          country,
          email,
          password,
          interest,
          category,
          industry,
          linkingType,
        } = values as LinkNewEntityFormValues;

        /* istanbul ignore next */
        //Scenario never exists
        const countryCode = country?.code ?? null;
        /* istanbul ignore next */
        //Scenario never exists
        const categoryValue = category ?? CompanyCategory.DIRECT;
        /* istanbul ignore next */
        //Scenario never exists
        const industryId = industry ?? null;

        await CompanyApi.post(session, {
          firstName,
          lastName,
          name: companyName,
          countryCode,
          email,
          password,
          interest,
          jobTitle,
          category: categoryValue,
          industryId,
          entityLink: {
            initiatingCompanyId: companyId,
            linkingType,
          },
        });

        setToast({
          severity: 'success',
          message: t('linkEntityModal.notify.linkEntitySuccess'),
        });
        onSuccess && onSuccess();
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
        onCloseModal && onCloseModal();
      }
    }
  };

  const getInitialValidationSchema = useMemo(() => {
    switch (linkEntityTypeSelected) {
      case EntityLinkOptionsType.NEW_ENTITY:
        return validationNewEntitySchema;
      case EntityLinkOptionsType.EXISTING_ENTITY:
        return validationExistingEntitySchema;
      default:
        return validationBaseLinkEntitySchema;
    }
  }, [linkEntityTypeSelected]);

  const getInitialFormValues = useMemo(() => {
    switch (linkEntityTypeSelected) {
      case EntityLinkOptionsType.NEW_ENTITY:
        return initialNewEntityFormValues;
      case EntityLinkOptionsType.EXISTING_ENTITY:
        return initialExistingEntityFormValues;
      default:
        return initialLinkEntityBaseFormValues;
    }
  }, [linkEntityTypeSelected]);

  const getLinkEntityModalErrorMessages = (
    errorName: string,
    actions: FormikHelpers<LinkEntityFormValues>,
    fieldName: string
  ) => {
    switch (errorName) {
      case LinkEntityModalErrorMessages.LINKING_COMPANY_IS_ALREADY_A_SUBSIDIARY:
        actions.setErrors({
          [fieldName]: t(
            `linkEntityModal.form.existingEntity.error.${LinkEntityModalErrorMessages.LINKING_COMPANY_IS_ALREADY_A_SUBSIDIARY}`
          ),
        });
        break;
      case LinkEntityModalErrorMessages.LINKING_COMPANY_IS_ALREADY_A_PARENT:
        actions.setErrors({
          [fieldName]: t(
            `linkEntityModal.form.existingEntity.error.${LinkEntityModalErrorMessages.LINKING_COMPANY_IS_ALREADY_A_PARENT}`
          ),
        });
        break;
      case LinkEntityModalErrorMessages.LINKING_COMPANY_IS_NOT_FOUND:
        actions.setErrors({
          [fieldName]: t(
            `linkEntityModal.form.existingEntity.error.${LinkEntityModalErrorMessages.LINKING_COMPANY_IS_NOT_FOUND}`
          ),
        });
        break;
      case LinkEntityModalErrorMessages.SAME_ENTITY_ID_CAN_NOT_BE_LINKED:
        actions.setErrors({
          [fieldName]: t(
            `linkEntityModal.form.existingEntity.error.${LinkEntityModalErrorMessages.SAME_ENTITY_ID_CAN_NOT_BE_LINKED}`
          ),
        });
        break;
      default:
        onCloseModal && onCloseModal();
        setToast({
          severity: 'error',
          message: errorName,
        });
        return;
    }
  };

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
        <Typography variant="h5" align="center">
          {t('linkEntityModal.title')}
        </Typography>
        <Typography variant="subtitle1">
          {t('linkEntityModal.description')}
        </Typography>
      </Box>

      <DialogContent
        sx={{
          paddingX: '3rem',
        }}
      >
        <Formik
          enableReinitialize
          onSubmit={onSubmit}
          initialValues={getInitialFormValues}
          validationSchema={getInitialValidationSchema}
        >
          <Form noValidate>
            <Box
              sx={{
                marginBottom: '1rem',
              }}
            >
              <Select
                required
                name="entityLinkOptions"
                options={entityLinkOptions}
                label={t('linkEntityModal.form.linkEntityType.label')}
                helperText={t('linkEntityModal.form.linkEntityType.helperText')}
                onChange={(item) =>
                  setLinkEntityTypeSelected(
                    item.target.value as EntityLinkOptionsType
                  )
                }
                dataTestId="staffAudit-clientList-entityManagement-linkEntity-entityLinkOptions"
              />
            </Box>
            {linkEntityForm}
            <Box
              sx={{
                gap: '1rem',
                display: 'flex',
                marginY: '2rem',
                justifyContent: 'space-around',
              }}
            >
              <Button
                variant="outlined"
                onClick={() => onCloseModal && onCloseModal()}
                sx={{
                  paddingX: '4rem',
                }}
                data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonCancel"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '4rem',
                }}
                data-testid="staffAudit-clientList-entityManagement-linkEntity-buttonLink"
              >
                {t('common:link')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
