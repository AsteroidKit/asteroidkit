import { CHAIN_NAMESPACES } from '@web3auth/base';
import { Web3AuthCore } from '@web3auth/core';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { Chain } from 'wagmi';
import { Wallet } from '../../../wallets/Wallet';
import { GenericSocialConnector } from './GenericSocialConnector';
import { OpenLoginAdapterConfig } from './OpenLoginAdapterConfig';

export const configureWeb3Auth = (chains: Chain[]) => {
  const chainConfig = {
    blockExplorer: chains[0]?.blockExplorers.default?.url,
    chainId: `0x${chains[0].id.toString(16)}`,
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    displayName: chains[0].name,
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
  };

  const web3AuthInstance = new Web3AuthCore({
    clientId:
      'BOpE2QwLzG8lTiFOblI4-5Tv7dEuQ3--ZCVdNpmnC7DqMhsxdKpUaE2tF3IUizccy7_B4h04uEj6g5zpqYbRf9c',
    chainConfig,
  });

  web3AuthInstance.configureAdapter(
    new OpenloginAdapter(OpenLoginAdapterConfig)
  );

  return web3AuthInstance;
};

interface ISocialConnector {
  chains: Chain[];
  web3AuthInstance: Web3AuthCore;
}

export const GoogleConnector = ({
  chains,
  web3AuthInstance,
}: ISocialConnector): Wallet => ({
  createConnector: (): any => {
    const connector = new GenericSocialConnector({
      chains,
      options: {
        socialProviderName: 'google',
        web3AuthInstance,
      },
    });
    return {
      connector,
    };
  },
  iconBackground: '#fff',
  iconUrl:
    'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png',
  id: 'openlogin_google',
  name: 'Google',
});

export const TwitchConnector = ({
  chains,
  web3AuthInstance,
}: ISocialConnector): Wallet => ({
  createConnector: (): any => {
    const connector = new GenericSocialConnector({
      chains,
      options: {
        socialProviderName: 'twitch',
        web3AuthInstance,
      },
    });

    return { connector };
  },
  iconBackground: '#fff',
  iconUrl:
    'https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/twitch-1024.png',
  id: 'openlogin_twitch',

  name: 'Twitch',
});
