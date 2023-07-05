import { isErrorResponse } from '@ayp/utils';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useCallback } from 'react';

import { Toast } from '@components/ui';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { useSessionCookies } from '@hooks';
import { CompanyApi } from '@services/apis/people';

export const UnlinkEntityModal: FC<{
  companyId: string;
  linkedCompanyId: string;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
}> = ({ companyId, linkedCompanyId, onCloseModal, onSuccess, setToast }) => {
  const { t } = useTranslation('staff-audit-client-list-company-id');
  const { session } = useSessionCookies();

  const onHandleUnlink = useCallback(async () => {
    try {
      await CompanyApi.unlinkEntity(session, companyId, linkedCompanyId);

      setToast({
        severity: 'success',
        message: t('unlinkEntityModal.notify.unlinkEntitySuccess'),
      });
      onSuccess();
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
      onCloseModal();
    }
  }, [
    companyId,
    linkedCompanyId,
    session,
    t,
    setToast,
    onCloseModal,
    onSuccess,
  ]);

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogContent
        sx={{
          padding: '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '1.5rem',
          }}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{ marginBottom: '1rem' }}
            data-testid="staffAudit-clientList-entityManagement-unlinkEntityModal-title"
          >
            {t('unlinkEntityModal.title')}
          </Typography>
          <Typography variant="subtitle1" align="center">
            {t('unlinkEntityModal.description')}
          </Typography>
        </Box>
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
            data-testid="staffAudit-clientList-entityManagement-unlinkEntityModal-buttonCancel"
          >
            {t('common:cancel')}
          </Button>
          <Button
            variant="contained"
            sx={{
              paddingX: '3rem',
            }}
            onClick={onHandleUnlink}
            data-testid="staffAudit-clientList-entityManagement-unlinkEntityModal-buttonUnlink"
          >
            {t('common:unlink')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
