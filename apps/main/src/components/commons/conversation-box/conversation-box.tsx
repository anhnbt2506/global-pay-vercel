import {
  BackendResource,
  Comment,
  CommonConversationApi,
  Conversation,
} from '@ayp/typings/commons';
import { HireType } from '@ayp/typings/entities';
import { KnownError, fireGtmEvent } from '@ayp/utils';
import { Box, Divider, Stack, SxProps, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { intlFormatDistance } from 'date-fns';
import { Form, Formik, FormikHelpers } from 'formik';
import { TFunction, useTranslation } from 'next-i18next';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Avatar, ButtonSubmit, Textarea } from '@components/ui';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { useSessionCookies } from '@hooks';

import {
  ConversationFormValues,
  initialValues,
  validationSchema,
} from './config';

const scrollBarStyle = {
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    width: '0.25rem',
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: '0.5rem',
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '0.5rem',
    backgroundColor: 'gray',
    borderTop: '0.25rem transparent solid',
    borderBottom: '0.25rem transparent solid',
    backgroundClip: 'content-box',
  },
};
export interface ConversationBoxApi {
  handleLookup: () => void;
}

export const useConversationBoxRef = () => useRef<ConversationBoxApi>(null);

interface ConversationProps {
  backendResource: BackendResource;
  conversationId: Nullable<string>;
  contextId: string;
  contextType: string;
  header: JSX.Element;
  commentPlaceholder?: string;
  conversationSx?: SxProps;
  hireType?: HireType;
  onCreate?: () => void;
  onReply?: () => void;
  onLookup?: () => void;
  onError?: () => void;
}

const CommentBox = ({
  content,
  createdAt,
  createdBy,
  type,
  t,
}: Pick<Comment, 'content' | 'createdAt' | 'createdBy' | 'type'> & {
  t: TFunction;
}) => {
  return (
    <Box sx={{ paddingY: '1rem', paddingX: '0.5rem' }}>
      <Avatar
        name={`${createdBy.firstName} ${createdBy.lastName}`}
        sx={{
          height: '2rem',
          width: '2rem',
          mb: '0.5rem',
        }}
      />
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {t(`comment-type:${type}`)}
      </Typography>
      <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
        <Typography variant="body2">
          by {createdBy.firstName} {createdBy.lastName}
        </Typography>
        <Typography variant="body2" sx={{ mx: '0.5rem' }}>
          •
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          {intlFormatDistance(new Date(createdAt), new Date())}
        </Typography>
      </Stack>
      <Typography variant="body2">{content}</Typography>
    </Box>
  );
};

export const ConversationBox = forwardRef<
  ConversationBoxApi,
  ConversationProps
>(
  (
    {
      backendResource,
      conversationId,
      contextId,
      contextType,
      header,
      commentPlaceholder,
      conversationSx,
      hireType,
      onCreate,
      onReply,
      onLookup,
      onError,
    },
    ref
  ) => {
    const { t } = useTranslation('conversation');
    const firstCommentBoxRef = useRef<HTMLElement>(null);
    const theme = useTheme();
    const { session } = useSessionCookies();
    const [conversationApi, setConversationApi] = useState<
      CommonConversationApi | undefined
    >(undefined);
    const [conversation, setConversation] =
      useState<Nullable<Conversation>>(null);

    const handleCreate = useCallback<
      (content: string) => Promise<Pick<Conversation, 'conversationId'>>
    >(
      async (content) => {
        /* istanbul ignore next */
        // this case cannot be reproduced
        if (!conversationApi) throw new KnownError('ConversationApiUndefined');

        const { conversation } = await conversationApi.create(session, {
          content,
          contextType,
          contextId,
        });
        onCreate && onCreate();

        return conversation;
      },
      [contextId, contextType, onCreate, session, conversationApi]
    );

    const handleLookup = useCallback<(conversationId: string) => void>(
      async (conversationId) => {
        /* istanbul ignore next */
        // this case cannot be reproduced
        if (!conversationApi) throw new KnownError('ConversationApiUndefined');

        const { conversation: response } = await conversationApi.lookup(
          session,
          conversationId
        );
        setConversation(response);
        /* istanbul ignore next */
        // this case cannot be reproduced
        onLookup && onLookup();
      },
      [onLookup, session, conversationApi]
    );

    const handleReply = useCallback<
      (conversationId: string, content: string) => void
    >(
      async (conversationId, content) => {
        /* istanbul ignore next */
        // this case cannot be reproduced
        if (!conversationApi) throw new KnownError('ConversationApiUndefined');

        await conversationApi.reply(session, conversationId, {
          content,
        });
        onReply && onReply();
      },
      [onReply, session, conversationApi]
    );

    const scrollToLastCommentBox = () => {
      firstCommentBoxRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    };

    const onSubmit = useCallback(
      async (
        value: ConversationFormValues,
        actions: FormikHelpers<ConversationFormValues>
      ) => {
        try {
          let conversationBoxId = '';
          if (conversation) {
            conversationBoxId = conversation.conversationId;
            await handleReply(conversationBoxId, value.content);
          } else {
            const conversation = await handleCreate(value.content);
            conversationBoxId = conversation.conversationId;
          }
          handleLookup(conversationBoxId);
          actions.setFieldValue('content', '', false);

          if (hireType === HireType.PEO || hireType === HireType.EOR) {
            fireGtmEvent<GTM_EVENTS>({
              event:
                GTM_EVENTS.CLIENT_PORTAL_ADD_PEO_EOR_SERVICE_AGREEMENT_COMMENT,
            });
          } else {
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_AGREEMENT_COMMENT,
            });
          }
        } catch (e) {
          onError && onError();
        }
      },
      [conversation, hireType, handleCreate, handleLookup, handleReply, onError]
    );

    useEffect(() => {
      if (conversationId && !conversation && conversationApi) {
        (async () => {
          try {
            await handleLookup(conversationId);
          } catch (error) {
            onError && onError();
          }
        })();
      }
    }, [
      conversationId,
      conversation,
      session,
      handleLookup,
      onError,
      conversationApi,
    ]);

    useEffect(() => {
      if (!conversation?.comments.length) return;

      scrollToLastCommentBox();
    }, [conversation]);

    useEffect(() => {
      (async () => {
        let conversationApi: CommonConversationApi | undefined = undefined;
        try {
          switch (backendResource) {
            case BackendResource.GP_FINTECH:
              conversationApi = (await import('@services/apis/fintech'))
                .ConversationApi;
              break;
            case BackendResource.GP_PEOPLE:
              conversationApi = (await import('@services/apis/people'))
                .ConversationApi;
              break;
          }
        } catch (e) {
          /* istanbul ignore next */
          // this case cannot be reproduced
          console.error(e);
        } finally {
          setConversationApi(conversationApi);
        }
      })();
    }, [backendResource]);

    useImperativeHandle(
      ref,
      () => ({
        handleLookup: () =>
          conversationId && conversationApi
            ? handleLookup(conversationId)
            : null,
      }),
      [conversationId, conversationApi, handleLookup]
    );

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.25rem',
          ...conversationSx,
        }}
      >
        {header}
        <Divider sx={{ my: '0.5rem' }} flexItem />
        <Stack sx={{ width: '100%' }}>
          <Formik
            onSubmit={onSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            <Form>
              <Textarea
                name="content"
                required
                placeholder={
                  commentPlaceholder ?? t('defaultCommentPlaceholder')
                }
                style={{
                  width: '100%',
                  height: '5rem',
                  padding: '0.5rem',
                  overflow: 'auto',
                  resize: 'none',
                  borderRadius: '0.25rem',
                  border: 'none',
                  outlineColor: theme.palette.primary.main,
                  background: theme.palette.background.default,
                }}
                dataTestId="conversation-box-field-content"
              />
              <ButtonSubmit
                data-testid="conversation-box-button-comment"
                sx={{
                  paddingX: '2rem',
                  marginTop: '0.5rem',
                  float: 'right',
                }}
              >
                {t('addComment')}
              </ButtonSubmit>
            </Form>
          </Formik>
        </Stack>
        {conversation?.comments && (
          <>
            <Divider sx={{ mt: '0.5rem', mb: '1rem' }} flexItem />
            <Box
              sx={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                ...scrollBarStyle,
              }}
              data-testid="conversation-box-comments"
            >
              <span ref={firstCommentBoxRef} />
              <Stack divider={<Divider />}>
                {[...conversation.comments]
                  .reverse()
                  .map(({ id, content, createdAt, createdBy, type }) => (
                    <CommentBox
                      key={id}
                      content={content}
                      createdAt={createdAt}
                      createdBy={createdBy}
                      type={type}
                      t={t}
                    />
                  ))}
              </Stack>
            </Box>
          </>
        )}
      </Box>
    );
  }
);

ConversationBox.displayName = 'ConversationBox';
