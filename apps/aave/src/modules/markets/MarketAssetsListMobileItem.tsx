import { Trans } from '@lingui/macro';
import { Box, Button, Divider } from '@mui/material';
import { SuperFestTooltip } from '@/components/infoTooltips/SuperFestTooltip';
import { VariableAPYTooltip } from '@/components/infoTooltips/VariableAPYTooltip';
import { NoData } from '@/components/primitives/NoData';
import { ReserveSubheader } from '@/components/ReserveSubheader';
import { useProtocolDataContext } from '@/hooks/useProtocolDataContext';
import { useRootStore } from '@/store/root';
import { MARKETS } from '@/utils/mixPanelEvents';
import { showSuperFestTooltip, Side } from '@/utils/utils';

import { IncentivesCard } from '../../components/incentives/IncentivesCard';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { Link, ROUTES } from '../../components/primitives/Link';
import { Row } from '../../components/primitives/Row';
import { ComputedReserveData } from '../../hooks/app-data-provider/useAppDataProvider';
import { ListMobileItemWrapper } from '../dashboard/lists/ListMobileItemWrapper';

export const MarketAssetsListMobileItem = ({ ...reserve }: ComputedReserveData) => {
  const { currentMarket } = useProtocolDataContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const isSuperfestOnSupplySide = showSuperFestTooltip(reserve.symbol, currentMarket, Side.SUPPLY);
  const isSuperfestOnBorrowSide = showSuperFestTooltip(reserve.symbol, currentMarket, Side.BORROW);

  return (
    <ListMobileItemWrapper
      symbol={reserve.symbol}
      iconSymbol={reserve.iconSymbol}
      name={reserve.name}
      underlyingAsset={reserve.underlyingAsset}
      currentMarket={currentMarket}
      isIsolated={reserve.isIsolated}
    >
      <Row caption={<Trans>Total supplied</Trans>} captionVariant="description" mb={3}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-end' },
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <FormattedNumber compact value={reserve.totalLiquidity} variant="secondary14" />
          <ReserveSubheader value={reserve.totalLiquidityUSD} rightAlign={true} />
        </Box>
      </Row>
      <Row
        caption={<Trans>Supply APY</Trans>}
        captionVariant="description"
        mb={3}
        align="flex-start"
      >
        <IncentivesCard
          align="flex-end"
          value={reserve.supplyAPY}
          incentives={reserve.aIncentivesData || []}
          symbol={reserve.symbol}
          variant="secondary14"
          tooltip={isSuperfestOnSupplySide && <SuperFestTooltip />}
        />
      </Row>

      <Divider sx={{ mb: 3 }} />

      <Row caption={<Trans>Total borrowed</Trans>} captionVariant="description" mb={3}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-end' },
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {Number(reserve.totalDebt) > 0 ? (
            <>
              <FormattedNumber compact value={reserve.totalDebt} variant="secondary14" />
              <ReserveSubheader value={reserve.totalDebtUSD} rightAlign={true} />
            </>
          ) : (
            <NoData variant={'secondary14'} color="text.secondary" />
          )}
        </Box>
      </Row>
      <Row
        caption={
          <VariableAPYTooltip
            text={<Trans>Borrow APY, variable</Trans>}
            key="APY_list_mob_variable_type"
            variant="description"
          />
        }
        captionVariant="description"
        mb={3}
        align="flex-start"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <IncentivesCard
            align="flex-end"
            value={Number(reserve.totalVariableDebtUSD) > 0 ? reserve.variableBorrowAPY : '-1'}
            incentives={reserve.vIncentivesData || []}
            symbol={reserve.symbol}
            variant="secondary14"
            tooltip={isSuperfestOnBorrowSide && <SuperFestTooltip />}
          />
          {!reserve.borrowingEnabled &&
            Number(reserve.totalVariableDebt) > 0 &&
            !reserve.isFrozen && <ReserveSubheader value={'Disabled'} />}
        </Box>
      </Row>
      {/* <Row
        caption={
          <StableAPYTooltip
            text={<Trans>Borrow APY, stable</Trans>}
            key="APY_list_mob_stable_type"
            variant="description"
          />
        }
        captionVariant="description"
        mb={4}
        align="flex-start"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <IncentivesCard
            align="flex-end"
            value={Number(reserve.totalStableDebtUSD) > 0 ? reserve.stableBorrowAPY : '-1'}
            incentives={reserve.sIncentivesData || []}
            symbol={reserve.symbol}
            variant="secondary14"
          />
          {!reserve.borrowingEnabled &&
            Number(reserve.totalStableDebt) > 0 &&
            !reserve.isFrozen && <ReserveSubheader value={'Disabled'} />}
        </Box>
      </Row> */}

      <Button
        variant="outlined"
        component={Link}
        href={ROUTES.reserveOverview(reserve.underlyingAsset, currentMarket)}
        fullWidth
        onClick={() => {
          trackEvent(MARKETS.DETAILS_NAVIGATION, {
            type: 'button',
            asset: reserve.underlyingAsset,
            market: currentMarket,
            assetName: reserve.name,
          });
        }}
      >
        <Trans>View details</Trans>
      </Button>
    </ListMobileItemWrapper>
  );
};
