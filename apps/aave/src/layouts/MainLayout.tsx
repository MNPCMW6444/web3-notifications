import { Box } from '@mui/material';
import React, { ReactNode } from 'react';
import AnalyticsConsent from '@/components/Analytics/AnalyticsConsent';
import { FeedbackModal } from '@/layouts/FeedbackDialog';
import { FORK_ENABLED } from '@/utils/marketsAndNetworksConfig';

import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import TopBarNotify from './TopBarNotify';

export function MainLayout({ children }: { children: ReactNode }) {
  const APP_BANNER_VERSION = '1.0.0';

  return (
    <>
      <TopBarNotify
        learnMoreLink="/markets/?marketName=proto_lido_v3"
        buttonText="View Market"
        notifyText="Aave Governance has deployed a new Lido market on Ethereum V3"
        bannerVersion={APP_BANNER_VERSION}
        icon={'/icons/tokens/ldo.svg'}
      />
      <AppHeader />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {children}
      </Box>

      <AppFooter />
      <FeedbackModal />
      {FORK_ENABLED ? null : <AnalyticsConsent />}
    </>
  );
}
