import { Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Meta } from '@/components/Meta';
import { useProposal } from '@/hooks/governance/useProposal';
import { useProposalVotes } from '@/hooks/governance/useProposalVotes';
import { MainLayout } from '@/layouts/MainLayout';
import { ProposalLifecycle } from '@/modules/governance/proposal/ProposalLifecycle';
import { ProposalOverview } from '@/modules/governance/proposal/ProposalOverview';
import { ProposalTopPanel } from '@/modules/governance/proposal/ProposalTopPanel';
import { VoteInfo } from '@/modules/governance/proposal/VoteInfo';
import { VotingResults } from '@/modules/governance/proposal/VotingResults';

import { ContentContainer } from '../../../../src/components/ContentContainer';

const GovVoteModal = dynamic(() =>
  import('../../../../src/components/transactions/GovVote/GovVoteModal').then(
    (module) => module.GovVoteModal
  )
);

export default function ProposalPage() {
  const { query } = useRouter();
  const proposalId = Number(query.proposalId);
  const {
    data: proposal,
    isLoading: proposalLoading,
    error: newProposalError,
  } = useProposal(proposalId);

  const proposalVotes = useProposalVotes({
    proposalId,
    votingChainId: proposal
      ? +proposal.subgraphProposal.votingPortal.votingMachineChainId
      : undefined,
  });

  return (
    <>
      {proposal && (
        <Meta
          imageUrl="https://app.aave.com/aaveMetaLogo-min.jpg"
          title={proposal.subgraphProposal.proposalMetadata.title}
          description={proposal.subgraphProposal.proposalMetadata.shortDescription}
        />
      )}
      <ProposalTopPanel />

      <ContentContainer>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <ProposalOverview
              proposal={proposal}
              error={!!newProposalError}
              loading={proposalLoading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            {proposal && <VoteInfo proposal={proposal} />}
            <VotingResults
              proposal={proposal}
              proposalVotes={proposalVotes}
              loading={proposalLoading}
            />
            <ProposalLifecycle proposal={proposal} />
          </Grid>
        </Grid>
      </ContentContainer>
    </>
  );
}

ProposalPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <MainLayout>
      {page}
      <GovVoteModal />
    </MainLayout>
  );
};
