import { Option } from '@ayp/typings/ui';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { TFunction } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useMemo } from 'react';

import { Autocomplete, ButtonSubmit } from '@components/ui';
import { CALENDAR_TYPE_OPTIONS } from '@configs/constants';

import { FilterType } from '../config';

const SelectionModal: FC<{
  t: TFunction;
  sectionName: Option<string>;
  setSectionName: Dispatch<SetStateAction<Option<string>>>;
  setShowSelectSection: Dispatch<SetStateAction<boolean>>;
  setFilters: Dispatch<SetStateAction<FilterType>>;
}> = ({ t, sectionName, setFilters, setSectionName, setShowSelectSection }) => {
  const calendarTypeOptions = useMemo(
    () =>
      CALENDAR_TYPE_OPTIONS.map((calendarType) => ({
        ...calendarType,
        value: calendarType.id,
        label: t(calendarType.label),
      })),
    [t]
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
          data-testid="staffSetupCalendar-selectionModal-title"
        >
          {t('selectSection.title')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          data-testid="staffSetupCalendar-selectionModal-description"
        >
          {t('selectSection.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={{
            sectionName,
          }}
          onSubmit={(values: { sectionName: Option<string> }) => {
            setSectionName(values.sectionName);
            setShowSelectSection(false);
            setFilters([]);
          }}
        >
          <Form>
            <Autocomplete
              required
              name="sectionName"
              options={calendarTypeOptions}
              label={t('selectSection.form.section.label')}
              helperText={t('selectSection.form.section.helperText')}
              dataTestId="staffSetupCalendar-sectionNameSelectField"
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
                onClick={() => {
                  /* istanbul ignore next */
                  // this function has been run through
                  setShowSelectSection(false);
                }}
                sx={{
                  paddingX: '3rem',
                }}
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffSetupCalendar-selectionModal-submitButton"
              >
                {t('common:update')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default SelectionModal;
