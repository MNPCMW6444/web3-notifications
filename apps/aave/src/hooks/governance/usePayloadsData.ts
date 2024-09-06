import { useQuery } from '@tanstack/react-query';
import { PayloadParams } from '@/services/GovernanceV3Service';
import { useSharedDependencies } from '@/ui-config/SharedDependenciesProvider';

export const usePayloadsData = (params: PayloadParams[]) => {
  const { governanceV3Service } = useSharedDependencies();
  return useQuery({
    queryFn: () => governanceV3Service.getMultiChainPayloadsData(params),
    queryKey: ['payloadsData'],
    cacheTime: 0,
    enabled: params.length > 0,
  });
};
