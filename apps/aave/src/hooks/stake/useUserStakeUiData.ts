import { Stake } from '@aave/contract-helpers';
import { useQuery } from '@tanstack/react-query';
import { useRootStore } from '@/store/root';
import { MarketDataType } from '@/ui-config/marketsConfig';
import { POLLING_INTERVAL, queryKeysFactory } from '@/ui-config/queries';
import { useSharedDependencies } from '@/ui-config/SharedDependenciesProvider';

import { getStakeIndex, oracles, stakedTokens } from './common';

export const useUserStakeUiData = (marketData: MarketDataType, select?: Stake) => {
  const { uiStakeDataService } = useSharedDependencies();
  const user = useRootStore((store) => store.account);
  return useQuery({
    queryFn: () =>
      uiStakeDataService.getUserStakeUIDataHumanized(marketData, user, stakedTokens, oracles),
    queryKey: queryKeysFactory.userStakeUiData(user, marketData, stakedTokens, oracles),
    enabled: !!user,
    refetchInterval: POLLING_INTERVAL,
    select: (data) => {
      if (select) {
        return [data.stakeUserData[getStakeIndex(select)]];
      }
      return data.stakeUserData;
    },
  });
};
