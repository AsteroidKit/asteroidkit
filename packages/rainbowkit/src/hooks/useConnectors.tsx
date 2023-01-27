import React, { useMemo, useState } from 'react';
import { configureChains, Connector } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets } from '../wallets/connectorsForWallets';
import { Wallet } from '../wallets/Wallet';
import { argentWallet, injectedWallet } from '../wallets/walletConnectors';

export interface AsteroidKitSyncContextValue {
  setValue: (wallets: () => Connector<any, any, any>[]) => void;
  wallets: Connector<any, any, any>[];
}

export const AsteroidKitSyncContext =
  React.createContext<AsteroidKitSyncContextValue>({
    setValue: () => {},
    wallets: [],
  });

const useAsteroidKitSyncStateValue = () => {
  const { chains } = configureChains([mainnet], [publicProvider()]);
  const defaultWallets = connectorsForWallets([
    {
      groupName: 'Popular',
      wallets: [argentWallet({ chains }) as Wallet],
    },
  ]);

  const [wallets, setValue] = useState(defaultWallets());

  return {
    setValue,
    wallets,
  };
};

export const AsteroidKitSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setValue, wallets } = useAsteroidKitSyncStateValue();

  return (
    <AsteroidKitSyncContext.Provider
      value={useMemo(
        () => ({
          setValue: (wallets: () => Connector<any, any, any>[]) => {
            setValue(wallets());
          },
          wallets,
        }),
        [wallets, setValue]
      )}
    >
      {children}
    </AsteroidKitSyncContext.Provider>
  );
};

export const useAsteroidKitSyncState = () => {
  const { setValue, wallets } = React.useContext(AsteroidKitSyncContext);

  return {
    setValue,
    wallets,
  };
};
