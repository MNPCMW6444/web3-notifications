import { Trans } from '@lingui/macro';
import React from 'react';
import { UserAuthenticated } from '@/components/UserAuthenticated';
import { ModalContextType, ModalType, useModalContext } from '@/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { CollateralChangeModalContent } from './CollateralChangeModalContent';

export const CollateralChangeModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;
  return (
    <BasicModal open={type === ModalType.CollateralChange} setOpen={close}>
      <ModalWrapper title={<Trans>Review tx</Trans>} underlyingAsset={args.underlyingAsset}>
        {(params) => (
          <UserAuthenticated>
            {(user) => <CollateralChangeModalContent {...params} user={user} />}
          </UserAuthenticated>
        )}
      </ModalWrapper>
    </BasicModal>
  );
};
