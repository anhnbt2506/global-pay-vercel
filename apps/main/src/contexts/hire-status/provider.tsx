import { ContextProviderLoading } from '@ayp/typings/commons';
import { HireStatus, Role } from '@ayp/typings/entities';
import { isUserPermitted } from '@ayp/utils/is-user-permitted';
import {
  FC,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import { useSessionCookies } from '@hooks';
import { WorkerEmploymentApi } from '@services/apis/people';

import Context from './context';

const Provider: FC<
  PropsWithChildren<{
    handleLoading: (loading: ContextProviderLoading) => void;
  }>
> = ({ children, handleLoading }): ReactElement => {
  const [state, setState] = useState<Nullable<HireStatus>>(null);
  const { session, status } = useSessionCookies();

  useEffect(() => {
    if (
      isUserPermitted([Role.GP_WORKER], session.user?.selectedUserContext.role)
    )
      return;

    handleLoading({ hireStatusProvider: false });
  }, [handleLoading, session.user]);

  useEffect(() => {
    const contextEmploymentId =
      session.user?.selectedUserContext.contextEmploymentId;

    if (contextEmploymentId && status === 'authenticated' && state === null) {
      (async () => {
        try {
          const { workerEmployment } =
            await WorkerEmploymentApi.getByEmploymentId(
              session,
              {
                attributes: ['id', 'status'],
              },
              contextEmploymentId
            );

          setState(workerEmployment.status);
        } catch (error) {
        } finally {
          handleLoading({ hireStatusProvider: false });
        }
      })();
    }
  }, [handleLoading, session, status, state]);

  const setHireStatus = (hireStatus: HireStatus) => {
    setState(hireStatus);
  };

  const value = {
    hireStatus: state,
    setHireStatus,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Provider;
