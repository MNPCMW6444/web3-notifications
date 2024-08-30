/*
import { UiPoolService } from "./UIPoolService";
import { getNetworkConfig } from "./marketsAndNetworksConfig";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { RotationProvider } from "./rotationProvider";
import userModel from "../mongo/auth/userModel";
import { sendEmail, sendPush, sendSMS } from "./sending";

const marketData = {
  marketTitle: "Ethereum",
  market: "proto_mainnet_v3",
  chainId: 1,
  v3: true,
  enabledFeatures: {
    governance: true,
    staking: true,
    liquiditySwap: true,
    collateralRepay: true,
    incentives: true,
    withdrawAndSwitch: true,
    debtSwitch: true,
    switch: true,
  },
  subgraphUrl: "https://api.thegraph.com/subgraphs/name/aave/protocol-v3",
  addresses: {
    LENDING_POOL_ADDRESS_PROVIDER: "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e",
    LENDING_POOL: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    WETH_GATEWAY: "0x893411580e590D62dDBca8a703d61Cc4A8c7b2b9",
    REPAY_WITH_COLLATERAL_ADAPTER: "0x02e7B8511831B1b02d9018215a0f8f500Ea5c6B3",
    SWAP_COLLATERAL_ADAPTER: "0xADC0A53095A0af87F3aa29FE0715B5c28016364e",
    WALLET_BALANCE_PROVIDER: "0xC7be5307ba715ce89b152f3Df0658295b3dbA8E2",
    UI_POOL_DATA_PROVIDER: "0x91c0eA31b49B69Ea18607702c5d9aC360bf3dE7d",
    UI_INCENTIVE_DATA_PROVIDER: "0x162A7AC02f547ad796CA549f757e2b8d1D9b10a6",
    COLLECTOR: "0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c",
    GHO_TOKEN_ADDRESS: "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f",
    GHO_UI_DATA_PROVIDER: "0x379c1EDD1A41218bdbFf960a9d5AD2818Bf61aE8",
    WITHDRAW_SWITCH_ADAPTER: "0x78F8Bd884C3D738B74B420540659c82f392820e0",
    DEBT_SWITCH_ADAPTER: "0x8761e0370f94f68Db8EaA731f4fC581f6AD0Bd68",
  },
  halIntegration: {
    URL: "https://app.hal.xyz/recipes/aave-v3-track-health-factor",
    marketName: "aavev3",
  },
};

const check = async () => {
  const providers: { [network: string]: any } = {};

  const getProvider = (chainId: any): any => {
    if (!providers[chainId]) {
      const config = getNetworkConfig(chainId);
      const chainProviders: string[] = [];
      if (config.privateJsonRPCUrl) {
        chainProviders.push(config.privateJsonRPCUrl);
      }
      if (config.publicJsonRPCUrl.length) {
        config.publicJsonRPCUrl.map((rpc: any) => chainProviders.push(rpc));
      }
      if (!chainProviders.length) {
        throw new Error(`${chainId} has no jsonRPCUrl configured`);
      }
      if (chainProviders.length === 1) {
        providers[chainId] = new StaticJsonRpcProvider(
          chainProviders[0],
          chainId,
        );
      } else {
        providers[chainId] = new RotationProvider(chainProviders, chainId);
      }
    }
    return providers[chainId];
  };

  const uiPoolService = new UiPoolService(getProvider);

  try {
    const reservesData = await uiPoolService.getReservesHumanized(marketData);
    return parseFloat(
      reservesData.reservesData.find(
        ({ underlyingAsset }) =>
          underlyingAsset === "0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee",
      )?.supplyCap,
    );
  } catch (error) {}
};

export const notify = async () => {
  const users = await userModel().find();

  const set = (userSecrets, handler) =>
    setTimeout(handler, userSecrets.interval_inseconds * 1000);

  const handler = async (user) => {
    //console.log("user: ", user);
    //   console.log("user._id: ", user._id);
    const uxx = await userModel().findById(user._id);
    //   console.log("u: ", uxx);

    const userSecrets = uxx.data.secrets;
    try {
      const value = await check();
      console.log("value: ", value);
      console.log("userSecrets.minimum: ", userSecrets.minimum);
      if (value > userSecrets.minimum) {
        sendSMS(value, userSecrets.minimum, userSecrets);
        sendEmail(value, userSecrets.minimum, userSecrets);
        sendPush(value, userSecrets.minimum, userSecrets);

        user.data.secrets.minimum = value;
        user.save();

        /!* if (userSecrets.loop === "yes") {
          set(userSecrets, () => handler(uxx));
        }*!/
      } /!* else {*!/
      set(userSecrets, () => handler(uxx));
      /!*  }*!/
    } catch (error) {
      console.error("Error during check:", error);
      set(userSecrets, () => handler(uxx));
    }
  };

  users.forEach((user) => {
    const { secrets } = user.data;
    if (secrets && secrets.interval_inseconds > 9) {
      handler(user);
    }
  });
};
*/
