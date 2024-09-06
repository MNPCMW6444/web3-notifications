import { BasicModal } from '@/components/primitives/BasicModal';
import { ModalType, useModalContext } from '@/hooks/useModal';

import { BridgeModalContent } from './BridgeModalContent';

export const BridgeModal = () => {
  const { type, close } = useModalContext();
  return (
    <BasicModal open={type === ModalType.Bridge} setOpen={close}>
      <BridgeModalContent />
    </BasicModal>
  );
};
