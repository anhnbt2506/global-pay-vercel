import { BackendResource } from '@ayp/typings/commons';
import { Clear, CommentOutlined } from '@mui/icons-material';
import { Drawer, IconButton, Stack, Typography } from '@mui/material';
import { FC, RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ConversationBox,
  ConversationBoxApi,
} from '@components/commons/conversation-box';
import {
  CHAT_SIDEBAR_WIDTH,
  CONVERSATION_CONTEXT_TYPE_COMPANY_PAYROLL,
  TOP_NAVIGIATION_HEIGHT,
} from '@configs/constants';

interface CommentSidebarProps {
  companyPayrollId: string;
  conversationBoxRef?: RefObject<ConversationBoxApi>;
  conversationId: Nullable<string>;
  dataTestId?: string;
  isDesktop: boolean;
  isOpen: boolean;
  onClose: VoidFunction;
}

export const PayrollCommentSidebar: FC<CommentSidebarProps> = ({
  companyPayrollId,
  conversationBoxRef,
  conversationId,
  dataTestId,
  isDesktop,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('payroll-company-payroll-id');

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      variant={isDesktop ? 'persistent' : 'temporary'}
      sx={{
        width: isDesktop ? `${CHAT_SIDEBAR_WIDTH}rem` : '100vw',
      }}
    >
      <ConversationBox
        contextId={companyPayrollId}
        conversationId={conversationId}
        contextType={CONVERSATION_CONTEXT_TYPE_COMPANY_PAYROLL}
        header={
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
              }}
            >
              <CommentOutlined />
              <Typography variant="subtitle1">
                {t('commentSidebar.title')}
              </Typography>
            </Stack>
            <IconButton
              data-testid={`${dataTestId}-buttonClose`}
              onClick={onClose}
            >
              <Clear />
            </IconButton>
          </Stack>
        }
        conversationSx={{
          marginTop: isDesktop ? `${TOP_NAVIGIATION_HEIGHT}rem` : 0,
          width: isDesktop ? `${CHAT_SIDEBAR_WIDTH}rem` : '100vw',
          height: isDesktop
            ? `calc(100vh - ${TOP_NAVIGIATION_HEIGHT}rem)`
            : '100vh',
        }}
        commentPlaceholder={t('commentSidebar.commentPlaceholder')}
        backendResource={BackendResource.GP_FINTECH}
        ref={conversationBoxRef}
      />
    </Drawer>
  );
};
