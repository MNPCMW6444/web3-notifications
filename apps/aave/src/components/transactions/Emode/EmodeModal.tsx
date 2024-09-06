import React from 'react';
import { UserAuthenticated } from '@/components/UserAuthenticated';
import { ModalContextType, ModalType, useModalContext } from '@/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { EmodeModalContent, EmodeModalType } from './EmodeModalContent';

export const EmodeModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    emode: EmodeModalType;
  }>;
  return (
    <BasicModal open={type === ModalType.Emode} setOpen={close}>
      <UserAuthenticated>
        {(user) => <EmodeModalContent user={user} mode={args.emode} />}
      </UserAuthenticated>
    </BasicModal>
  );
};
