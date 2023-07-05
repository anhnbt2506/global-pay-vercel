import { CalendarSelectionType } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useTranslation } from 'next-i18next';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { ButtonSubmit, Toast } from '@components/ui';
import { ERROR_NAMES } from '@configs/errors';
import { useSessionCookies } from '@hooks';
import { CalendarTagApi } from '@services/apis/people';

import {
  FormValues,
  initialValues as defaultInitialValues,
  mapToRequestBody,
  validationSchema,
} from './configs';
import { TagFormFields } from './form-fields';

interface TagModalProps {
  onCloseModal: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
  initialValues?: FormValues;
  isEditing?: boolean;
}

export const TagModal: FC<TagModalProps> = ({
  onCloseModal,
  isEditing,
  initialValues = defaultInitialValues,
  setToast,
}) => {
  const { t } = useTranslation('staff-setup-calendar');
  const { session } = useSessionCookies();

  const [adjustmentCalendarTagsOptions, setAdjustmentCalendarTagsOptions] =
    useState<Option<string>[]>([]);

  const [adjustmentCalendarTagId, setAdjustmentCalendarTagId] =
    useState<Nullable<Option<string>>>(null);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        if (isEditing && !!values.calendarTagId) {
          await CalendarTagApi.updateCalendarTag(
            values.calendarTagId,
            mapToRequestBody({
              ...values,
              isAdjustmentRequired: !!values.isAdjustmentRequired,
            }),
            session
          );
        } else {
          await CalendarTagApi.createCalendarTag(
            mapToRequestBody(values),
            session
          );
        }
        await onCloseModal();
        setToast({
          severity: 'success',
          message: t('success'),
        });
      } catch (e) {
        /* istanbul ignore next */
        // this case doesn't necessary to test
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message:
              e.error.name === ERROR_NAMES.TAG_CANNOT_BE_ADJUSTED
                ? t('tagCannotBeAdjusted')
                : e.error.name,
          });
        }
      }
    },
    [isEditing, session, setToast, onCloseModal, t]
  );

  const onHandleAdjustmentCalendarTags = useCallback(
    (isAdjustmentRequired: boolean) => {
      if (isAdjustmentRequired) {
        (async () => {
          try {
            const { calendarTags } = await CalendarTagApi.getSelection(
              CalendarSelectionType.TAG,
              session
            );
            setAdjustmentCalendarTagsOptions(
              calendarTags.map(({ calendarTagId, name }) => ({
                label: name,
                id: calendarTagId,
              }))
            );

            if (initialValues.adjustmentCalendarTagId) {
              setAdjustmentCalendarTagId(
                calendarTags
                  .map(({ calendarTagId, name }) => ({
                    label: name,
                    id: calendarTagId,
                  }))
                  .find(
                    (calendar) =>
                      calendar.id ===
                      (initialValues.adjustmentCalendarTagId as unknown)
                  ) as Option<string>
              );
            }
          } catch (e) {
            /* istanbul ignore next */
            if (isErrorResponse(e)) {
              setToast({
                severity: 'error',
                message: e.error.name,
              });
            }
          }
        })();
      }
    },
    [session, setToast, setAdjustmentCalendarTagId, initialValues]
  );

  const generateForm = useMemo(
    () => (
      <Formik
        initialValues={{ ...initialValues, adjustmentCalendarTagId }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        <Form noValidate>
          <TagFormFields
            isEditing={isEditing}
            onHandleAdjustmentCalendarTags={onHandleAdjustmentCalendarTags}
            adjustmentCalendarTagsOptions={adjustmentCalendarTagsOptions}
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
              onClick={onCloseModal}
              sx={{
                paddingX: '3rem',
              }}
              data-testid="staffSetupCalendar-tagModal-cancelButton"
            >
              {t('common:cancel')}
            </Button>
            <ButtonSubmit
              variant="contained"
              sx={{
                paddingX: '3rem',
              }}
              data-testid="staffSetupCalendar-tagModal-submitButton"
            >
              {isEditing ? t('common:update') : t('common:create')}
            </ButtonSubmit>
          </Box>
        </Form>
      </Formik>
    ),
    [
      adjustmentCalendarTagId,
      adjustmentCalendarTagsOptions,
      onHandleAdjustmentCalendarTags,
      initialValues,
      t,
      isEditing,
      onSubmit,
      onCloseModal,
    ]
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
          data-testid="staffSetupCalendar-tagModal-title"
        >
          {isEditing
            ? t('tagModal.editModalTitle')
            : t('tagModal.newModalTitle')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          data-testid="staffSetupCalendar-tagModal-description"
        >
          {t('tagModal.newModalDescription')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        {generateForm}
      </DialogContent>
    </Dialog>
  );
};
