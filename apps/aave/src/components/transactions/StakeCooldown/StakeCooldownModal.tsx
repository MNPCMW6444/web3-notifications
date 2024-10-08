import React from 'react';
import { ModalType, useModalContext } from '@/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { StakeCooldownModalContent } from './StakeCooldownModalContent';

export const StakeCooldownModal = () => {
  const { type, close, args } = useModalContext();
  return (
    <BasicModal open={type === ModalType.StakeCooldown} setOpen={close}>
      {args?.stakeAssetName && args.icon && (
        <StakeCooldownModalContent stakeAssetName={args.stakeAssetName} icon={args.icon} />
      )}
    </BasicModal>
  );
};
