import { CHAIN_NAMESPACES } from '@web3auth/base';
import { Web3AuthCore } from '@web3auth/core';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { Connector } from 'wagmi';
import { Wallet } from '../../../wallets/Wallet';
import { GenericSocialConnector } from './GenericSocialConnector';
import { OpenLoginAdapterConfig } from './OpenLoginAdapterConfig';

const chainConfig = {
  blockExplorer: 'https://etherscan.io/',

  chainId: '0x1',
  // this is ethereum chain config, change if other chain(Solana, Polygon)
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  rpcTarget:
    'https://eth-mainnet.g.alchemy.com/v2/oZsv-F9NN3NhersEryE56jM08jomw0Ya',
  ticker: 'ETH',
  tickerName: 'Ethereum',
};

const web3AuthInstance = new Web3AuthCore({
  chainConfig,
  clientId:
    'BOpE2QwLzG8lTiFOblI4-5Tv7dEuQ3--ZCVdNpmnC7DqMhsxdKpUaE2tF3IUizccy7_B4h04uEj6g5zpqYbRf9c',
});

web3AuthInstance.configureAdapter(new OpenloginAdapter(OpenLoginAdapterConfig));

export const GoogleConnector = ({
  chains,
}: any): Wallet<Connector<any, any, any>> => ({
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

export const TwitchConnector = ({ chains }: any): Wallet => ({
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
