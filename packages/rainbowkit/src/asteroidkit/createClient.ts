import { configureChains, createClient as wagmiCreateClient } from 'wagmi';
import {
  avalanche,
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { WalletList } from '../wallets/Wallet';
import { connectorsForWallets } from '../wallets/connectorsForWallets';
import { metaMaskWallet } from '../wallets/walletConnectors';

export const createClient = (): any => {
  const { chains, provider } = configureChains(
    [mainnet, optimism, avalanche, polygon, polygonMumbai],
    [
      alchemyProvider({
        // This is Alchemy's default API key.
        // You can get your own at https://dashboard.alchemyapi.io
        apiKey: 'oZsv-F9NN3NhersEryE56jM08jomw0Ya',
      }),
      publicProvider(),
    ]
  );

  const walletList: WalletList = [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet({ chains, shimDisconnect: true })],
    },
  ];

  const connectors = connectorsForWallets(walletList);

  const wagmiClient = wagmiCreateClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return wagmiClient;
};
