import { Trans } from '@lingui/macro';
import { Paper, Typography } from '@mui/material';
import { ConnectWalletButton } from '@/components/WalletConnection/ConnectWalletButton';
import { useRootStore } from '@/store/root';

import { DelegatedInfoPanel } from './DelegatedInfoPanel';
import { RepresentativesInfoPanel } from './RepresentativesInfoPanel';
import { VotingPowerInfoPanel } from './VotingPowerInfoPanel';

export const UserGovernanceInfo = () => {
  const account = useRootStore((state) => state.account);

  return account ? (
    <>
      <VotingPowerInfoPanel />
      <DelegatedInfoPanel />
      <RepresentativesInfoPanel />
    </>
  ) : (
    <Paper sx={{ p: 6 }}>
      <Typography variant="h3" sx={{ mb: { xs: 6, xsm: 10 } }}>
        <Trans>Your info</Trans>
      </Typography>
      <Typography sx={{ mb: 6 }} color="text.secondary">
        <Trans>Please connect a wallet to view your personal information here.</Trans>
      </Typography>
      <ConnectWalletButton funnel="Governance Page" />
    </Paper>
  );
};
