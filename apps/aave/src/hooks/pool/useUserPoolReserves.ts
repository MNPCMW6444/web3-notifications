import { useQueries } from '@tanstack/react-query';
import { UserReservesDataHumanized } from '@/services/UIPoolService';
import { useRootStore } from '@/store/root';
import { MarketDataType } from '@/ui-config/marketsConfig';
import { POLLING_INTERVAL, queryKeysFactory } from '@/ui-config/queries';
import { useSharedDependencies } from '@/ui-config/SharedDependenciesProvider';

import { HookOpts } from '../commonTypes';

export const useUserPoolsReservesHumanized = <T = UserReservesDataHumanized>(
  marketsData: MarketDataType[],
  opts?: HookOpts<UserReservesDataHumanized, T>
) => {
  const { uiPoolService } = useSharedDependencies();
  const user = useRootStore((store) => store.account);
  return useQueries({
    queries: marketsData.map((marketData) => ({
      queryKey: queryKeysFactory.userPoolReservesDataHumanized(user, marketData),
      queryFn: () => uiPoolService.getUserReservesHumanized(marketData, user),
      enabled: !!user,
      refetchInterval: POLLING_INTERVAL,
      ...opts,
    })),
  });
};

export const useUserPoolReservesHumanized = (marketData: MarketDataType) => {
  return useUserPoolsReservesHumanized([marketData])[0];
};
