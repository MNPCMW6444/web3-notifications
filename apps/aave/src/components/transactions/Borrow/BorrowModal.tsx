import { Trans } from '@lingui/macro';
import React, { useState } from 'react';
import { UserAuthenticated } from '@/components/UserAuthenticated';
import { ModalContextType, ModalType, useModalContext } from '@/hooks/useModal';
import { useProtocolDataContext } from '@/hooks/useProtocolDataContext';
import { useRootStore } from '@/store/root';
import { displayGhoForMintableMarket } from '@/utils/ghoUtilities';
import { GENERAL } from '@/utils/mixPanelEvents';

import { BasicModal } from '../../primitives/BasicModal';
import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { BorrowModalContent } from './BorrowModalContent';
import { GhoBorrowModalContent } from './GhoBorrowModalContent';

export const BorrowModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;
  const { currentMarket } = useProtocolDataContext();

  const [borrowUnWrapped, setBorrowUnWrapped] = useState(true);
  const [trackEvent] = useRootStore((store) => [store.trackEvent]);

  const handleBorrowUnwrapped = (borrowUnWrapped: boolean) => {
    trackEvent(GENERAL.OPEN_MODAL, {
      modal: 'Unwrap Asset',
      asset: args.underlyingAsset,
      assetWrapped: borrowUnWrapped,
    });
    setBorrowUnWrapped(borrowUnWrapped);
  };

  return (
    <BasicModal open={type === ModalType.Borrow} setOpen={close}>
      <ModalWrapper
        action="borrow"
        title={<Trans>Borrow</Trans>}
        underlyingAsset={args.underlyingAsset}
        keepWrappedSymbol={!borrowUnWrapped}
      >
        {(params) => (
          <UserAuthenticated>
            {(user) =>
              displayGhoForMintableMarket({ symbol: params.symbol, currentMarket }) ? (
                <GhoBorrowModalContent {...params} user={user} />
              ) : (
                <BorrowModalContent
                  {...params}
                  user={user}
                  unwrap={borrowUnWrapped}
                  setUnwrap={handleBorrowUnwrapped}
                />
              )
            }
          </UserAuthenticated>
        )}
      </ModalWrapper>
    </BasicModal>
  );
};
