import React from 'react';
import { ModalType, useModalContext } from '@/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { GovVoteModalContent } from './GovVoteModalContent';

export const GovVoteModal = () => {
  const { type, close, args } = useModalContext();
  return (
    <BasicModal open={type === ModalType.GovVote} setOpen={close}>
      {args?.power && args?.proposal && args?.support !== undefined && (
        <GovVoteModalContent proposal={args.proposal} support={args.support} power={args.power} />
      )}
    </BasicModal>
  );
};
