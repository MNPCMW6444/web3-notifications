import { Trans } from '@lingui/macro';
import React from 'react';
import { BasicModal } from '@/components/primitives/BasicModal';
import { UserAuthenticated } from '@/components/UserAuthenticated';
import { ModalContextType, ModalType, useModalContext } from '@/hooks/useModal';

import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { SwapModalContent } from './SwapModalContent';

export const SwapModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;
  return (
    <BasicModal open={type === ModalType.Swap} setOpen={close}>
      <ModalWrapper title={<Trans>Switch</Trans>} underlyingAsset={args.underlyingAsset}>
        {(params) => (
          <UserAuthenticated>
            {(user) => <SwapModalContent {...params} user={user} />}
          </UserAuthenticated>
        )}
      </ModalWrapper>
    </BasicModal>
  );
};
