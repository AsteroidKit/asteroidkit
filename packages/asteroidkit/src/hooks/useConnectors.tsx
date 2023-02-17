import React, { useMemo, useState } from 'react';
import { configureChains, Connector } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { Wallet } from '../wallets/Wallet';
import { connectorsForWallets } from '../wallets/connectorsForWallets';
import { argentWallet } from '../wallets/walletConnectors';

export interface AsteroidKitSyncContextValue {
  setValue: (wallets: () => Connector<any, any, any>[]) => void;
  wallets: Connector<any, any, any>[];
  ready: boolean;
  setReady: (ready: boolean) => void;
}

export const AsteroidKitSyncContext =
  React.createContext<AsteroidKitSyncContextValue>({
    ready: false,
    setReady: () => {},
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
  const [ready, setReady] = useState(false);

  return {
    ready,
    setReady,
    setValue,
    wallets,
  };
};

export const AsteroidKitSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { ready, setReady, setValue, wallets } = useAsteroidKitSyncStateValue();

  return (
    <AsteroidKitSyncContext.Provider
      value={useMemo(
        () => ({
          ready,
          setReady: (ready: boolean) => {
            setReady(ready);
          },
          setValue: (wallets: () => Connector<any, any, any>[]) => {
            setValue(wallets());
          },
          wallets,
        }),
        [ready, setReady, wallets, setValue]
      )}
    >
      {children}
    </AsteroidKitSyncContext.Provider>
  );
};

export const useAsteroidKitSyncState = () => {
  const { ready, setReady, setValue, wallets } = React.useContext(
    AsteroidKitSyncContext
  );

  return {
    ready,
    setReady,
    setValue,
    wallets,
  };
};
