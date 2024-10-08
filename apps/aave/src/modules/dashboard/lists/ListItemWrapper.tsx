import { Tooltip, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { BorrowDisabledToolTip } from '@/components/infoTooltips/BorrowDisabledToolTip';
import { OffboardingTooltip } from '@/components/infoTooltips/OffboardingToolTip';
import { PausedTooltip } from '@/components/infoTooltips/PausedTooltip';
import { StETHCollateralToolTip } from '@/components/infoTooltips/StETHCollateralToolTip';
import { SuperFestTooltip } from '@/components/infoTooltips/SuperFestTooltip';
import { AssetsBeingOffboarded } from '@/components/Warnings/OffboardingWarning';
import { useAssetCaps } from '@/hooks/useAssetCaps';
import { useRootStore } from '@/store/root';
import { CustomMarket } from '@/ui-config/marketsConfig';
import { DASHBOARD_LIST_COLUMN_WIDTHS } from '@/utils/dashboardSortUtils';
import { DASHBOARD } from '@/utils/mixPanelEvents';

import { AMPLToolTip } from '../../../components/infoTooltips/AMPLToolTip';
import { FrozenTooltip } from '../../../components/infoTooltips/FrozenTooltip';
import { RenFILToolTip } from '../../../components/infoTooltips/RenFILToolTip';
import { ListColumn } from '../../../components/lists/ListColumn';
import { ListItem } from '../../../components/lists/ListItem';
import { Link, ROUTES } from '../../../components/primitives/Link';
import { TokenIcon } from '../../../components/primitives/TokenIcon';

interface ListItemWrapperProps {
  symbol: string;
  iconSymbol: string;
  name: string;
  detailsAddress: string;
  children: ReactNode;
  currentMarket: CustomMarket;
  frozen?: boolean;
  paused?: boolean;
  borrowEnabled?: boolean;
  showSupplyCapTooltips?: boolean;
  showBorrowCapTooltips?: boolean;
  showDebtCeilingTooltips?: boolean;
  showSuperFestTooltip?: boolean;
}

export const ListItemWrapper = ({
  symbol,
  iconSymbol,
  children,
  name,
  detailsAddress,
  currentMarket,
  frozen,
  paused,
  borrowEnabled = true,
  showSupplyCapTooltips = false,
  showBorrowCapTooltips = false,
  showDebtCeilingTooltips = false,
  showSuperFestTooltip = false,
  ...rest
}: ListItemWrapperProps) => {
  const { supplyCap, borrowCap, debtCeiling } = useAssetCaps();

  const showFrozenTooltip = frozen && symbol !== 'renFIL' && symbol !== 'BUSD';
  const showRenFilTooltip = frozen && symbol === 'renFIL';
  const showAmplTooltip = !frozen && symbol === 'AMPL';
  const showstETHTooltip = symbol == 'stETH';
  const offboardingDiscussion = AssetsBeingOffboarded[currentMarket]?.[symbol];
  const showBorrowDisabledTooltip = !frozen && !borrowEnabled;
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <ListItem {...rest}>
      <ListColumn maxWidth={DASHBOARD_LIST_COLUMN_WIDTHS.CELL} isRow>
        <Link
          onClick={() =>
            trackEvent(DASHBOARD.DETAILS_NAVIGATION, {
              type: 'Row click',
              market: currentMarket,
              assetName: name,
              asset: detailsAddress,
            })
          }
          href={ROUTES.reserveOverview(detailsAddress, currentMarket)}
          noWrap
          sx={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <TokenIcon symbol={iconSymbol} fontSize="large" />
          <Tooltip title={`${name} (${symbol})`} arrow placement="top">
            <Typography variant="subheader1" sx={{ ml: 3 }} noWrap data-cy={`assetName`}>
              {symbol}
            </Typography>
          </Tooltip>
        </Link>
        {paused && <PausedTooltip />}
        {showSuperFestTooltip && <SuperFestTooltip />}
        {showFrozenTooltip && <FrozenTooltip symbol={symbol} currentMarket={currentMarket} />}
        {showRenFilTooltip && <RenFILToolTip />}
        {showAmplTooltip && <AMPLToolTip />}
        {showstETHTooltip && <StETHCollateralToolTip />}
        {offboardingDiscussion && <OffboardingTooltip discussionLink={offboardingDiscussion} />}
        {showBorrowDisabledTooltip && (
          <BorrowDisabledToolTip symbol={symbol} currentMarket={currentMarket} />
        )}
        {showSupplyCapTooltips && supplyCap.displayMaxedTooltip({ supplyCap })}
        {showBorrowCapTooltips && borrowCap.displayMaxedTooltip({ borrowCap })}
        {showDebtCeilingTooltips && debtCeiling.displayMaxedTooltip({ debtCeiling })}
      </ListColumn>
      {children}
    </ListItem>
  );
};
