import { useQuery } from '@tanstack/react-query';
import { BigNumber, Contract } from 'ethers';
import { useRootStore } from '@/store/root';
import { MarketDataType } from '@/ui-config/marketsConfig';
import { POLLING_INTERVAL, queryKeysFactory } from '@/ui-config/queries';
import { useSharedDependencies } from '@/ui-config/SharedDependenciesProvider';
import { getProvider } from '@/utils/marketsAndNetworksConfig';

export const useBridgeTokens = (currentMarketData: MarketDataType, tokenOracle: string) => {
  const { poolTokensBalanceService } = useSharedDependencies();
  const user = useRootStore((store) => store.account);

  return useQuery({
    queryFn: async () => {
      const provider = getProvider(currentMarketData.chainId);
      const oracle = new Contract(
        tokenOracle,
        [
          'function latestAnswer() public view returns (int256 answer)',
          'function decimals() external view returns (uint8)',
        ],
        provider
      );

      const [latestAnswer, decimals]: [BigNumber, number] = await Promise.all([
        oracle.latestAnswer(),
        oracle.decimals(),
      ]);

      const balances = await poolTokensBalanceService.getGhoBridgeBalancesTokenBalances(
        currentMarketData,
        user
      );

      return {
        ...balances,
        tokenPriceUSD: latestAnswer.toNumber() / BigNumber.from(10).pow(decimals).toNumber(),
      };
    },
    queryKey: queryKeysFactory.getGhoBridgeBalances(user, currentMarketData),
    enabled: !!user,
    refetchInterval: POLLING_INTERVAL,
    initialData: {
      bridgeTokenBalance: '0',
      bridgeTokenBalanceFormatted: '0',
      tokenPriceUSD: 1,
      address: currentMarketData.addresses.GHO_TOKEN_ADDRESS,
    },
  });
};
