import { useQuery } from '@tanstack/react-query';
import { useRootStore } from '@/store/root';
import { MarketDataType } from '@/ui-config/marketsConfig';
import { queryKeysFactory } from '@/ui-config/queries';
import { useSharedDependencies } from '@/ui-config/SharedDependenciesProvider';

export const useApprovedAmount = ({
  chainId,
  token,
  spender,
}: {
  chainId: number;
  token: string;
  spender: string;
}) => {
  const { approvedAmountService } = useSharedDependencies();
  const user = useRootStore((store) => store.account);
  return useQuery({
    queryFn: () => approvedAmountService.getApprovedAmount(chainId, user, token, spender),
    queryKey: queryKeysFactory.approvedAmount(user, token, spender, chainId),
  });
};

export const usePoolApprovedAmount = (marketData: MarketDataType, token: string) => {
  const { approvedAmountService } = useSharedDependencies();
  const user = useRootStore((store) => store.account);
  return useQuery({
    queryFn: () => approvedAmountService.getPoolApprovedAmount(marketData, user, token),
    queryKey: queryKeysFactory.poolApprovedAmount(user, token, marketData),
  });
};
