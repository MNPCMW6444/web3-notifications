import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import StyledToggleButton from '@/components/StyledToggleButton';
import StyledToggleButtonGroup from '@/components/StyledToggleButtonGroup';
import { useProtocolDataContext } from '@/hooks/useProtocolDataContext';
import { useRootStore } from '@/store/root';

import { ConnectWalletPaper } from '../src/components/ConnectWalletPaper';
import { ContentContainer } from '../src/components/ContentContainer';
import { MainLayout } from '../src/layouts/MainLayout';
import { useWeb3Context } from '../src/libs/hooks/useWeb3Context';
import { DashboardContentWrapper } from '../src/modules/dashboard/DashboardContentWrapper';
import { DashboardTopPanel } from '../src/modules/dashboard/DashboardTopPanel';

export default function Home() {
  const { currentAccount, loading: web3Loading } = useWeb3Context();
  const { currentMarket } = useProtocolDataContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const [mode, setMode] = useState<'supply' | 'borrow' | ''>('supply');
  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Dashboard',
      Market: currentMarket,
    });
  }, [trackEvent]);

  return (
    <>
      <DashboardTopPanel />

      <ContentContainer>
        {currentAccount && (
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              justifyContent: { xs: 'center', xsm: 'flex-start' },
              mb: { xs: 3, xsm: 4 },
            }}
          >
            <StyledToggleButtonGroup
              color="primary"
              value={mode}
              exclusive
              onChange={(_, value) => setMode(value)}
              sx={{ width: { xs: '100%', xsm: '359px' }, height: '44px' }}
            >
              <StyledToggleButton value="supply" disabled={mode === 'supply'}>
                <Typography variant="subheader1">
                  <Trans>Supply</Trans>
                </Typography>
              </StyledToggleButton>
              <StyledToggleButton value="borrow" disabled={mode === 'borrow'}>
                <Typography variant="subheader1">
                  <Trans>Borrow</Trans>
                </Typography>
              </StyledToggleButton>
            </StyledToggleButtonGroup>
          </Box>
        )}

        {currentAccount ? (
          <DashboardContentWrapper isBorrow={mode === 'borrow'} />
        ) : (
          <ConnectWalletPaper loading={web3Loading} />
        )}
      </ContentContainer>
    </>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};