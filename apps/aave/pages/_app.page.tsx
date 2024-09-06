// import '/public/fonts/inter/inter.css';
// import '@/styles/variables.css';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ReactNode, useEffect, useState } from 'react';
import { AddressBlocked } from '@/components/AddressBlocked';
import { Meta } from '@/components/Meta';
import { TransactionEventHandler } from '@/components/TransactionEventHandler';
import { GasStationProvider } from '@/components/transactions/GasStation/GasStationProvider';
import { AppDataProvider } from '@/hooks/app-data-provider/useAppDataProvider';
import { ModalContextProvider } from '@/hooks/useModal';
import { Web3ContextProvider } from '@/libs/web3-data-provider/Web3Provider';
import { useRootStore } from '@/store/root';
import { SharedDependenciesProvider } from '@/ui-config/SharedDependenciesProvider';

import createEmotionCache from '../src/createEmotionCache';
import { AppGlobalStyles } from '../src/layouts/AppGlobalStyles';
import { LanguageProvider } from '../src/libs/LanguageProvider';

const SwitchModal = dynamic(() =>
  import('@/components/transactions/Switch/SwitchModal').then((module) => module.SwitchModal)
);

const BridgeModal = dynamic(() =>
  import('@/components/transactions/Bridge/BridgeModal').then((module) => module.BridgeModal)
);

const BorrowModal = dynamic(() =>
  import('@/components/transactions/Borrow/BorrowModal').then((module) => module.BorrowModal)
);
const ClaimRewardsModal = dynamic(() =>
  import('@/components/transactions/ClaimRewards/ClaimRewardsModal').then(
    (module) => module.ClaimRewardsModal
  )
);
const CollateralChangeModal = dynamic(() =>
  import('@/components/transactions/CollateralChange/CollateralChangeModal').then(
    (module) => module.CollateralChangeModal
  )
);
const DebtSwitchModal = dynamic(() =>
  import('@/components/transactions/DebtSwitch/DebtSwitchModal').then(
    (module) => module.DebtSwitchModal
  )
);
const EmodeModal = dynamic(() =>
  import('@/components/transactions/Emode/EmodeModal').then((module) => module.EmodeModal)
);
const FaucetModal = dynamic(() =>
  import('@/components/transactions/Faucet/FaucetModal').then((module) => module.FaucetModal)
);
const RateSwitchModal = dynamic(() =>
  import('@/components/transactions/RateSwitch/RateSwitchModal').then(
    (module) => module.RateSwitchModal
  )
);
const RepayModal = dynamic(() =>
  import('@/components/transactions/Repay/RepayModal').then((module) => module.RepayModal)
);
const SupplyModal = dynamic(() =>
  import('@/components/transactions/Supply/SupplyModal').then((module) => module.SupplyModal)
);
const SwapModal = dynamic(() =>
  import('@/components/transactions/Swap/SwapModal').then((module) => module.SwapModal)
);
const WithdrawModal = dynamic(() =>
  import('@/components/transactions/Withdraw/WithdrawModal').then((module) => module.WithdrawModal)
);
const StakingMigrateModal = dynamic(() =>
  import('@/components/transactions/StakingMigrate/StakingMigrateModal').then(
    (module) => module.StakingMigrateModal
  )
);

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWeb3Library(provider: any): providers.Web3Provider {
  const library = new providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}
export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  const initializeMixpanel = useRootStore((store) => store.initializeMixpanel);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL;
  useEffect(() => {
    if (MIXPANEL_TOKEN) {
      initializeMixpanel();
    } else {
      console.log('no analytics tracking');
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Meta
        title={'Open Source Liquidity Protocol'}
        description={
          'Aave is an Open Source Protocol to create Non-Custodial Liquidity Markets to earn interest on supplying and borrowing assets with a variable or stable interest rate. The protocol is designed for easy integration into your products and services.'
        }
        imageUrl="https://app.aave.com/aave-com-opengraph.png"
      />
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <Web3ReactProvider getLibrary={getWeb3Library}>
            <Web3ContextProvider>
              <AppGlobalStyles>
                <AddressBlocked>
                  <ModalContextProvider>
                    <SharedDependenciesProvider>
                      <AppDataProvider>
                        <GasStationProvider>
                          {getLayout(<Component {...pageProps} />)}
                          <SupplyModal />
                          <WithdrawModal />
                          <BorrowModal />
                          <RepayModal />
                          <CollateralChangeModal />
                          <RateSwitchModal />
                          <DebtSwitchModal />
                          <ClaimRewardsModal />
                          <EmodeModal />
                          <SwapModal />
                          <FaucetModal />
                          <TransactionEventHandler />
                          <SwitchModal />
                          <StakingMigrateModal />
                          <BridgeModal />
                        </GasStationProvider>
                      </AppDataProvider>
                    </SharedDependenciesProvider>
                  </ModalContextProvider>
                </AddressBlocked>
              </AppGlobalStyles>
            </Web3ContextProvider>
          </Web3ReactProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </LanguageProvider>
    </CacheProvider>
  );
}
