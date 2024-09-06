import { useQuery } from '@tanstack/react-query';
import { constants } from 'ethers';
import request, { gql } from 'graphql-request';
import { lifecycleToBadge } from '@/modules/governance/StateBadge';
import { getLifecycleState, getProposalVoteInfo } from '@/modules/governance/utils/formatProposal';
import { GovernanceV3Service } from '@/services/GovernanceV3Service';
import { VotingMachineService } from '@/services/VotingMachineService';
import { useRootStore } from '@/store/root';
import { governanceV3Config } from '@/ui-config/governanceConfig';
import { useSharedDependencies } from '@/ui-config/SharedDependenciesProvider';

import {
  getSubgraphProposalMetadata,
  Proposal,
  proposalQueryFields,
  SubgraphProposal,
} from './useProposals';

const getProposalQuery = gql`
  query getProposal($id: Int!) {
    proposal(id: $id) {
      ${proposalQueryFields}
    }
  }
`;

export const getProposal = async (proposalId: number) => {
  const result = await request<{ proposal: SubgraphProposal }>(
    governanceV3Config.governanceCoreSubgraphUrl,
    getProposalQuery,
    {
      id: proposalId,
    }
  );
  return result.proposal;
};

async function fetchProposal(
  proposalId: number,
  votingMachineService: VotingMachineService,
  governanceV3Service: GovernanceV3Service,
  user?: string
): Promise<Proposal> {
  const proposal = await getProposal(proposalId);

  const votingMachineParams = {
    id: +proposal.id,
    snapshotBlockHash: proposal.snapshotBlockHash || constants.HashZero,
    chainId: +proposal.votingPortal.votingMachineChainId,
    votingMachineAddress: proposal.votingPortal.votingMachine,
  };
  const payloadParams = proposal.payloads.map((p) => {
    return {
      payloadControllerAddress: p.payloadsController,
      payloadId: +p.id.split('_')[1],
      chainId: +p.chainId,
    };
  });
  const [proposalMetadata, votingMachineData, payloadsData] = await Promise.all([
    getSubgraphProposalMetadata(proposal),
    votingMachineService.getProposalsData([votingMachineParams], user).then((data) => data[0]),
    governanceV3Service.getMultiChainPayloadsData(payloadParams),
  ]);

  const enhancedSubgraphProposal = {
    ...proposal,
    votes: {
      forVotes: votingMachineData.proposalData.forVotes,
      againstVotes: votingMachineData.proposalData.againstVotes,
    },
    proposalMetadata,
  };

  const lifecycleState = getLifecycleState(proposal, votingMachineData, payloadsData);
  const votingInfo = getProposalVoteInfo(enhancedSubgraphProposal);
  const badgeState = lifecycleToBadge(lifecycleState, votingInfo);

  return {
    subgraphProposal: enhancedSubgraphProposal,
    votingMachineData,
    payloadsData,
    lifecycleState,
    badgeState,
    votingInfo,
  };
}

export const useProposal = (proposalId: number) => {
  const { votingMachineSerivce, governanceV3Service } = useSharedDependencies();
  const user = useRootStore((store) => store.account);
  return useQuery({
    queryFn: () => fetchProposal(proposalId, votingMachineSerivce, governanceV3Service, user),
    queryKey: ['governance_proposal', proposalId, user],
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !isNaN(proposalId),
  });
};
