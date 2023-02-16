/* eslint-disable import/no-extraneous-dependencies */
import { Address, Chain, Connector, normalizeChainId } from '@wagmi/core';
import {
  ADAPTER_STATUS,
  IWeb3Auth,
  SafeEventEmitterProvider,
} from '@web3auth/base';
import { providers, Signer } from 'ethers';

import { getAddress } from 'ethers/lib/utils';
import { UserRejectedRequestError } from 'wagmi';

const IS_SERVER = typeof window === 'undefined';

type SocialProviderName = 'google' | 'twitch';

export class GenericSocialConnector extends Connector {
  ready = !IS_SERVER;
  id: string = 'socialConnector';
  name: string = 'Social Connector';
  provider: SafeEventEmitterProvider | null = null;
  web3AuthInstance: IWeb3Auth;
  initialChainId: number;
  socialProviderName: SocialProviderName;

  constructor(config: {
    chains: Chain[];
    options: {
      web3AuthInstance: IWeb3Auth;
      socialProviderName: SocialProviderName;
    };
  }) {
    super(config);
    this.web3AuthInstance = config.options.web3AuthInstance;
    this.socialProviderName = config.options.socialProviderName;
    this.initialChainId = config.chains[0].id;
  }

  async connect(): Promise<any> {
    try {
      this.emit('message', {
        type: 'connecting',
      });

      if (this.web3AuthInstance.status === ADAPTER_STATUS.NOT_READY) {
        await this.web3AuthInstance.init();
      }

      let { provider } = this.web3AuthInstance;

      if (!provider) {
        provider = await this.web3AuthInstance.connectTo('openlogin', {
          loginProvider: this.options.socialProviderName,
        });
      }

      if (!provider) {
        throw new Error('Provider not found');
      }

      const signer = await this.getSigner();
      const account = (await signer.getAddress()) as Address;

      provider.on('accountsChanged', this.onAccountsChanged.bind(this));
      provider.on('chainChanged', this.onChainChanged.bind(this));

      const chainId = await this.getChainId();
      const unsupported = this.isChainUnsupported(chainId);
      return {
        account,
        chain: {
          id: chainId,
          unsupported,
        },
        provider,
      };
    } catch (error) {
      // console.error('error while connecting', error);
      throw new UserRejectedRequestError('Something went wrong');
    }
  }

  async getAccount(): Promise<Address> {
    const p = await this.getProvider();

    if (!p) {
      throw new Error('No Provider');
    }

    const provider = new providers.Web3Provider(p);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    return account as Address;
  }
  async getChainId(): Promise<number> {
    try {
      if (this.provider) {
        const chainId = await this.provider.request({ method: 'eth_chainId' });
        if (chainId) {
          return normalizeChainId(chainId as string);
        }
      }
      if (this.initialChainId) {
        return this.initialChainId;
      }
      throw new Error('Chain ID is not defined');
    } catch (error) {
      // console.error('error', error);
      throw error;
    }
  }

  async getProvider() {
    if (this.provider) {
      return this.provider;
    }

    this.provider = this.web3AuthInstance.provider;

    if (!this.provider) {
      throw new Error('Provider not found');
    }

    return this.provider;
  }

  async getSigner(): Promise<Signer> {
    const provider = new providers.Web3Provider(
      (await this.getProvider()) as SafeEventEmitterProvider
    );
    const signer = provider.getSigner();
    return signer;
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!(account && this.provider);
    } catch {
      return false;
    }
  }

  async switchChain(chainId: number) {
    try {
      const chain = this.chains.find(x => x.id === chainId);
      if (!chain) throw new Error(`Unsupported chainId: ${chainId}`);
      const provider = await this.getProvider();

      if (!provider) throw new Error('Please login first');
      provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            blockExplorerUrls: [chain.blockExplorers?.default?.url],
            chainId: `0x${chain.id.toString(16)}`,
            chainName: chain.name,
            nativeCurrency: {
              symbol: chain.nativeCurrency?.symbol || 'ETH',
            },
            rpcUrls: [chain.rpcUrls.default.http],
          },
        ],
      });
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${chain.id.toString(16)}`,
          },
        ],
      });
      return chain;
    } catch (error) {
      // console.error('Error: Cannot change chain', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.web3AuthInstance.logout();
    this.provider = null;
  }

  protected onAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) this.emit('disconnect');
    else {
      this.emit('change', { account: `0x${getAddress(accounts[0])}` });
    }
  }

  protected isChainUnsupported(chainId: number): boolean {
    return !this.chains.some(x => x.id === chainId);
  }

  protected onChainChanged(chainId: string | number): void {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit('change', { chain: { id, unsupported } });
  }

  protected onDisconnect(): void {
    this.emit('disconnect');
  }
}
