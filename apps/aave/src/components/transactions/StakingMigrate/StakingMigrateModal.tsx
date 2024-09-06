import React from 'react';
import { BasicModal } from '@/components/primitives/BasicModal';
import { ModalType, useModalContext } from '@/hooks/useModal';

import { StakingMigrateModalContent } from './StakingMigrateModalContent';

export const StakingMigrateModal = () => {
  const { type, close } = useModalContext();

  return (
    <BasicModal open={type === ModalType.StakingMigrate} setOpen={close}>
      <StakingMigrateModalContent />
    </BasicModal>
  );
};
