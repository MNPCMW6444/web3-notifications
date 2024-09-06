import * as React from 'react';
import { useEffect } from 'react';
import { ContentContainer } from '@/components/ContentContainer';
import { MainLayout } from '@/layouts/MainLayout';
import { HistoryTopPanel } from '@/modules/history/HistoryTopPanel';
import { HistoryWrapper } from '@/modules/history/HistoryWrapper';
import { useRootStore } from '@/store/root';

export default function History() {
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'History',
    });
  }, [trackEvent]);
  return (
    <>
      <HistoryTopPanel />
      <ContentContainer>
        <HistoryWrapper />
      </ContentContainer>
    </>
  );
}

History.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
