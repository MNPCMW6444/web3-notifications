import { AssetCapsProvider } from '@/hooks/useAssetCaps';
import { useProtocolDataContext } from '@/hooks/useProtocolDataContext';
import { DashboardReserve } from '@/utils/dashboardSortUtils';
import { displayGhoForMintableMarket } from '@/utils/ghoUtilities';

import { BorrowedPositionsListItem } from './BorrowedPositionsListItem';
import { GhoBorrowedPositionsListItem } from './GhoBorrowedPositionsListItem';

export interface BorrowedPositionsListItemWrapperProps {
  item: DashboardReserve;
  disableEModeSwitch: boolean;
}

export const BorrowedPositionsListItemWrapper = ({
  item,
  disableEModeSwitch,
}: BorrowedPositionsListItemWrapperProps) => {
  const { currentMarket } = useProtocolDataContext();

  return (
    <AssetCapsProvider asset={item.reserve}>
      {displayGhoForMintableMarket({ symbol: item.reserve.symbol, currentMarket }) ? (
        <GhoBorrowedPositionsListItem {...item} />
      ) : (
        <BorrowedPositionsListItem item={item} disableEModeSwitch={disableEModeSwitch} />
      )}
    </AssetCapsProvider>
  );
};
