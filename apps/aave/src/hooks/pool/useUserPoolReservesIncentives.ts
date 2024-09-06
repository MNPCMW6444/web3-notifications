import { UserReservesIncentivesDataHumanized } from '@aave/contract-helpers';
import { useQueries } from '@tanstack/react-query';
import { useRootStore } from '@/store/root';
import { MarketDataType } from '@/ui-config/marketsConfig';
import { POLLING_INTERVAL, queryKeysFactory } from '@/ui-config/queries';
import { useSharedDependencies } from '@/ui-config/SharedDependenciesProvider';

import { HookOpts } from '../commonTypes';

export const useUserPoolsReservesIncentivesHumanized = <T = UserReservesIncentivesDataHumanized[]>(
  marketsData: MarketDataType[],
  opts?: HookOpts<UserReservesIncentivesDataHumanized[], T>
) => {
  const { uiIncentivesService } = useSharedDependencies();
  const user = useRootStore((store) => store.account);
  return useQueries({
    queries: marketsData.map((marketData) => ({
      queryKey: queryKeysFactory.userPoolReservesIncentiveDataHumanized(user, marketData),
      queryFn: () => uiIncentivesService.getUserReservesIncentivesData(marketData, user),

      enabled: !!user,
      refetchInterval: POLLING_INTERVAL,
      ...opts,
    })),
  });
};

export const useUserPoolReservesIncentivesHumanized = (marketData: MarketDataType) => {
  return useUserPoolsReservesIncentivesHumanized([marketData])[0];
};
