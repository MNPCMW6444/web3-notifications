import { InterestRate, ProtocolAction } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { useTransactionHandler } from '@/helpers/useTransactionHandler';
import { ComputedReserveData } from '@/hooks/app-data-provider/useAppDataProvider';
import { useRootStore } from '@/store/root';

import { TxActionsWrapper } from '../TxActionsWrapper';

export type RateSwitchActionsProps = {
  poolReserve: ComputedReserveData;
  isWrongNetwork: boolean;
  currentRateMode: InterestRate;
  blocked: boolean;
};

export const RateSwitchActions = ({
  poolReserve,
  isWrongNetwork,
  currentRateMode,
  blocked,
}: RateSwitchActionsProps) => {
  const swapBorrowRateMode = useRootStore((state) => state.swapBorrowRateMode);

  const { action, loadingTxns, mainTxState, requiresApproval } = useTransactionHandler({
    tryPermit: false,
    handleGetTxns: async () => {
      return await swapBorrowRateMode({
        reserve: poolReserve.underlyingAsset,
        interestRateMode: currentRateMode,
      });
    },
    protocolAction: ProtocolAction.switchBorrowRateMode,
    eventTxInfo: {
      asset: poolReserve.underlyingAsset,
      assetName: poolReserve.name,
      previousState: currentRateMode,
      newState:
        currentRateMode === InterestRate.Variable ? InterestRate.Stable : InterestRate.Variable,
    },
    skip: blocked,
  });

  return (
    <TxActionsWrapper
      requiresApproval={requiresApproval}
      blocked={blocked}
      preparingTransactions={loadingTxns}
      mainTxState={mainTxState}
      isWrongNetwork={isWrongNetwork}
      actionText={<Trans>Switch rate</Trans>}
      actionInProgressText={<Trans>Switching rate</Trans>}
      handleAction={action}
    />
  );
};
