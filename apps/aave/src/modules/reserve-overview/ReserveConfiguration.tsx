import { ExternalLinkIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Box, Button, Divider, SvgIcon } from '@mui/material';
import { getFrozenProposalLink } from '@/components/infoTooltips/FrozenTooltip';
import { PausedTooltipText } from '@/components/infoTooltips/PausedTooltip';
import { FormattedNumber } from '@/components/primitives/FormattedNumber';
import { Link } from '@/components/primitives/Link';
import { Warning } from '@/components/primitives/Warning';
import { AMPLWarning } from '@/components/Warnings/AMPLWarning';
import { BorrowDisabledWarning } from '@/components/Warnings/BorrowDisabledWarning';
import {
  AssetsBeingOffboarded,
  OffboardingWarning,
} from '@/components/Warnings/OffboardingWarning';
import { ComputedReserveData } from '@/hooks/app-data-provider/useAppDataProvider';
import { useAssetCaps } from '@/hooks/useAssetCaps';
import { useProtocolDataContext } from '@/hooks/useProtocolDataContext';
import { BROKEN_ASSETS } from '@/hooks/useReservesHistory';
import { useRootStore } from '@/store/root';
import { GENERAL } from '@/utils/mixPanelEvents';

import { BorrowInfo } from './BorrowInfo';
import { InterestRateModelGraphContainer } from './graphs/InterestRateModelGraphContainer';
import { ReserveEModePanel } from './ReserveEModePanel';
import { PanelItem, PanelRow, PanelTitle } from './ReservePanels';
import { SupplyInfo } from './SupplyInfo';

type ReserveConfigurationProps = {
  reserve: ComputedReserveData;
};

export const ReserveConfiguration: React.FC<ReserveConfigurationProps> = ({ reserve }) => {
  const { currentNetworkConfig, currentMarketData, currentMarket } = useProtocolDataContext();
  const reserveId =
    reserve.underlyingAsset + currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER;
  const renderCharts =
    !!currentNetworkConfig.ratesHistoryApiUrl &&
    !currentMarketData.disableCharts &&
    !BROKEN_ASSETS.includes(reserveId);
  const { supplyCap, borrowCap, debtCeiling } = useAssetCaps();
  const showSupplyCapStatus: boolean = reserve.supplyCap !== '0';
  const showBorrowCapStatus: boolean = reserve.borrowCap !== '0';
  const trackEvent = useRootStore((store) => store.trackEvent);

  const offboardingDiscussion = AssetsBeingOffboarded[currentMarket]?.[reserve.symbol];

  return (
    <>
      <Box>
        {reserve.isFrozen && !offboardingDiscussion ? (
          <Warning sx={{ mt: '16px', mb: '40px' }} severity="error">
            <Trans>
              This asset is frozen due to an Aave community decision.{' '}
              <Link
                href={getFrozenProposalLink(reserve.symbol, currentMarket)}
                sx={{ textDecoration: 'underline' }}
              >
                <Trans>More details</Trans>
              </Link>
            </Trans>
          </Warning>
        ) : offboardingDiscussion ? (
          <Warning sx={{ mt: '16px', mb: '40px' }} severity="error">
            <OffboardingWarning discussionLink={offboardingDiscussion} />
          </Warning>
        ) : (
          reserve.symbol == 'AMPL' && (
            <Warning sx={{ mt: '16px', mb: '40px' }} severity="warning">
              <AMPLWarning />
            </Warning>
          )
        )}

        {reserve.isPaused ? (
          reserve.symbol === 'MAI' ? (
            <Warning sx={{ mt: '16px', mb: '40px' }} severity="error">
              <Trans>
                MAI has been paused due to a community decision. Supply, borrows and repays are
                impacted.{' '}
                <Link
                  href={
                    'https://governance.aave.com/t/arfc-add-mai-to-arbitrum-aave-v3-market/12759/8'
                  }
                  sx={{ textDecoration: 'underline' }}
                >
                  <Trans>More details</Trans>
                </Link>
              </Trans>
            </Warning>
          ) : (
            <Warning sx={{ mt: '16px', mb: '40px' }} severity="error">
              <PausedTooltipText />
            </Warning>
          )
        ) : null}
      </Box>

      <PanelRow>
        <PanelTitle>Supply Info</PanelTitle>
        <SupplyInfo
          reserve={reserve}
          currentMarketData={currentMarketData}
          renderCharts={renderCharts}
          showSupplyCapStatus={showSupplyCapStatus}
          supplyCap={supplyCap}
          debtCeiling={debtCeiling}
        />
      </PanelRow>

      {(reserve.borrowingEnabled || Number(reserve.totalDebt) > 0) && (
        <>
          <Divider sx={{ my: { xs: 6, sm: 10 } }} />
          <PanelRow>
            <PanelTitle>Borrow info</PanelTitle>
            <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: '100%', width: '100%' }}>
              {!reserve.borrowingEnabled && (
                <Warning sx={{ mb: '40px' }} severity="error">
                  <BorrowDisabledWarning symbol={reserve.symbol} currentMarket={currentMarket} />
                </Warning>
              )}
              <BorrowInfo
                reserve={reserve}
                currentMarketData={currentMarketData}
                currentNetworkConfig={currentNetworkConfig}
                renderCharts={renderCharts}
                showBorrowCapStatus={showBorrowCapStatus}
                borrowCap={borrowCap}
              />
            </Box>
          </PanelRow>
        </>
      )}

      {reserve.eModeCategoryId !== 0 && (
        <>
          <Divider sx={{ my: { xs: 6, sm: 10 } }} />
          <ReserveEModePanel reserve={reserve} />
        </>
      )}

      {(reserve.borrowingEnabled || Number(reserve.totalDebt) > 0) && (
        <>
          <Divider sx={{ my: { xs: 6, sm: 10 } }} />

          <PanelRow>
            <PanelTitle>Interest rate model</PanelTitle>
            <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: '100%', width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                <PanelItem title={<Trans>Utilization Rate</Trans>} className="borderless">
                  <FormattedNumber
                    value={reserve.borrowUsageRatio}
                    percent
                    variant="main16"
                    compact
                  />
                </PanelItem>
                <Button
                  onClick={() => {
                    trackEvent(GENERAL.EXTERNAL_LINK, {
                      asset: reserve.underlyingAsset,
                      Link: 'Interest Rate Strategy',
                      assetName: reserve.name,
                    });
                  }}
                  href={currentNetworkConfig.explorerLinkBuilder({
                    address: reserve.interestRateStrategyAddress,
                  })}
                  endIcon={
                    <SvgIcon sx={{ width: 14, height: 14 }}>
                      <ExternalLinkIcon />
                    </SvgIcon>
                  }
                  component={Link}
                  size="small"
                  variant="outlined"
                  sx={{ verticalAlign: 'top' }}
                >
                  <Trans>Interest rate strategy</Trans>
                </Button>
              </Box>
              <InterestRateModelGraphContainer reserve={reserve} />
            </Box>
          </PanelRow>
        </>
      )}
    </>
  );
};