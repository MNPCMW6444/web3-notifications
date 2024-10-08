import { blo } from 'blo';
import { utils } from 'ethers';
import { useEffect, useState } from 'react';
import { getENSProvider } from '@/utils/marketsAndNetworksConfig';

const mainnetProvider = getENSProvider();

interface EnsResponse {
  name?: string;
  avatar?: string;
}

const useGetEns = (address: string): EnsResponse => {
  const [ensName, setEnsName] = useState<string | undefined>(undefined);
  const [ensAvatar, setEnsAvatar] = useState<string | undefined>(undefined);
  const getName = async (address: string) => {
    try {
      const name = await mainnetProvider.lookupAddress(address);
      setEnsName(name ? name : undefined);
    } catch (error) {
      console.error('ENS name lookup error', error);
    }
  };

  const getAvatar = async (name: string) => {
    try {
      const labelHash = utils.keccak256(utils.toUtf8Bytes(name?.replace('.eth', '')));
      const result: { background_image: string } = await (
        await fetch(
          `https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/${labelHash}/`
        )
      ).json();
      setEnsAvatar(
        result && result.background_image ? result.background_image : blo(address as `0x${string}`)
      );
    } catch (error) {
      console.error('ENS avatar lookup error', error);
    }
  };

  useEffect(() => {
    if (address) {
      setEnsAvatar(blo(address as `0x${string}`));
      getName(address);
    } else {
      setEnsName(undefined);
    }
  }, [address]);

  useEffect(() => {
    if (ensName) {
      getAvatar(ensName);
    }
  }, [ensName]);

  return { name: ensName, avatar: ensAvatar };
};

export default useGetEns;
