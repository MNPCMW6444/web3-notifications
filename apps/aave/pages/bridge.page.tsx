import * as React from 'react';
import { useEffect } from 'react';
import { ContentContainer } from '@/components/ContentContainer';
import { MainLayout } from '@/layouts/MainLayout';
import { BridgeTopPanel } from '@/modules/bridge/BridgeTopPanel';
import { BridgeWrapper } from '@/modules/bridge/BridgeWrapper';
import { useRootStore } from '@/store/root';

export default function Bridge() {
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Bridge Transactions',
    });
  }, [trackEvent]);
  return (
    <>
      <BridgeTopPanel />
      <ContentContainer>
        <BridgeWrapper />
      </ContentContainer>
    </>
  );
}

Bridge.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
