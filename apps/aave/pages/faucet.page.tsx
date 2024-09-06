import dynamic from 'next/dynamic';
import { MainLayout } from '@/layouts/MainLayout';
import FaucetAssetsList from '@/modules/faucet/FaucetAssetsList';
import { FaucetTopPanel } from '@/modules/faucet/FaucetTopPanel';

import { ContentContainer } from '../src/components/ContentContainer';

const FaucetModal = dynamic(() =>
  import('../src/components/transactions/Faucet/FaucetModal').then((module) => module.FaucetModal)
);
export default function Faucet() {
  return (
    <>
      <FaucetTopPanel />
      <ContentContainer>
        <FaucetAssetsList />
      </ContentContainer>
    </>
  );
}

Faucet.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <MainLayout>
      {page}
      <FaucetModal />
    </MainLayout>
  );
};
