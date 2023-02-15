import { Alchemy, Network, OwnedNft, OwnedNftsResponse } from 'alchemy-sdk';
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi';
import { isMobile } from '../../utils/isMobile';
import { AsyncImage } from '../AsyncImage/AsyncImage';
import { Avatar } from '../Avatar/Avatar';
import { Box } from '../Box/Box';
import { CloseButton } from '../CloseButton/CloseButton';
import { abbreviateETHBalance } from '../ConnectButton/abbreviateETHBalance';
import { formatAddress } from '../ConnectButton/formatAddress';
import { formatENS } from '../ConnectButton/formatENS';
import { CopiedIcon } from '../Icons/Copied';
import { CopyIcon } from '../Icons/Copy';
import { DisconnectIcon } from '../Icons/Disconnect';
import { SpinnerIcon } from '../Icons/Spinner';
import { MenuButton } from '../MenuButton/MenuButton';
import { ShowRecentTransactionsContext } from '../RainbowKitProvider/ShowRecentTransactionsContext';
import { Text } from '../Text/Text';
import { TxList } from '../Txs/TxList';
import { ProfileDetailsAction } from './ProfileDetailsAction';

interface ProfileDetailsProps {
  address: ReturnType<typeof useAccount>['address'];
  balanceData: ReturnType<typeof useBalance>['data'];
  ensAvatar: ReturnType<typeof useEnsAvatar>['data'];
  ensName: ReturnType<typeof useEnsName>['data'];
  onClose: () => void;
  onDisconnect: () => void;
}

interface CollectionListProps {
  items: AssetListProps[];
  onClick?: (selected: AssetListProps) => void;
}

interface OptionSelectProps {
  item: AssetListProps;
  onClick?: () => void;
}

interface AssetListProps {
  address: string;
  image: string;
  name: string;
  type: 'coin' | 'collectable';
  balance: string;
}

interface CoinMetadata {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  logo: string;
}

const getCollectionName = (collection: OwnedNft): string => {
  const openseaName = collection.contract.openSea?.collectionName;
  const contractName = collection.contract.name;
  if (!openseaName && !contractName) return 'Unnamed';
  if (!openseaName) return contractName ?? 'Unnamed';
  return openseaName;
};

const mapCollectionsToAssets = (collections: OwnedNft[]): AssetListProps[] => {
  let addresses = [] as string[];

  return collections
    .map(collection => {
      return {
        address: collection.contract.address,
        balance: `${collection.balance}`,
        image: collection.contract.openSea?.imageUrl ?? '',
        name: getCollectionName(collection),
        type: 'collectable',
      };
    })
    .reduce((acc, curr) => {
      if (!addresses.includes(curr.address)) {
        addresses.push(curr.address);
        acc.push(curr as AssetListProps);
      }
      return acc;
    }, [] as AssetListProps[]);
};

const mapCoinsToAssets = (coins: CoinMetadata[]): AssetListProps[] => {
  return coins.map(coin => {
    return {
      address: coin.address,
      balance: coin.balance,
      image: coin.logo,
      name: coin.name,
      type: 'coin',
    };
  });
};

const SelectedAssetIcon = ({ item, onClick }: OptionSelectProps) => {
  const mobile = isMobile();
  const chainIconSize = mobile ? '36' : '28';

  return (
    <Box display="flex" flexDirection="column" gap="4" padding="2">
      <Fragment>
        <MenuButton
          currentlySelected
          onClick={() => (onClick ? onClick() : null)}
          testId={`chain-option-${item.address}`}
        >
          <Box fontFamily="body" fontSize="16" fontWeight="bold">
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                gap="4"
                height={chainIconSize}
              >
                <Box height="full" marginRight="8">
                  <AsyncImage
                    borderRadius="full"
                    height={chainIconSize}
                    src={
                      item.image !== ''
                        ? item.image
                        : 'https://ipcsp.org.br/wp-content/themes/consultix/images/no-image-found-360x250.png'
                    }
                    width={chainIconSize}
                  />
                </Box>
                <div>{item.name}</div>
              </Box>
            </Box>
          </Box>
        </MenuButton>
      </Fragment>
    </Box>
  );
};

const AssetListItem = ({ items, onClick }: CollectionListProps) => {
  const mobile = isMobile();
  const chainIconSize = mobile ? '36' : '28';

  const els = items.map((item, index) => {
    return (
      <Fragment key={index}>
        <MenuButton
          currentlySelected={false}
          onClick={() => (onClick ? onClick(item) : null)}
          testId={`chain-option-${item.address}`}
        >
          <Box fontFamily="body" fontSize="16" fontWeight="bold">
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                gap="4"
                height={chainIconSize}
              >
                <Box height="full" marginRight="8">
                  <AsyncImage
                    borderRadius="full"
                    height={chainIconSize}
                    src={
                      item.image !== ''
                        ? item.image
                        : 'https://ipcsp.org.br/wp-content/themes/consultix/images/no-image-found-360x250.png'
                    }
                    width={chainIconSize}
                  />
                </Box>
                <div>{item.name}</div>
              </Box>

              {item.type === 'coin' && (
                <Box
                  alignItems="center"
                  display="flex"
                  flexDirection="row"
                  marginRight="6"
                >
                  <Text color="modalText" size="14" weight="medium">
                    {item.balance}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        </MenuButton>
      </Fragment>
    );
  });

  return (
    <Box display="flex" flexDirection="column" gap="4" padding="2">
      {els}
    </Box>
  );
};

const getNetworkById = (id: number) => {
  switch (id) {
    case 1:
      return Network.ETH_MAINNET;
    case 137:
      return Network.MATIC_MAINNET;
    case 10:
      return Network.OPT_MAINNET;
    case 80001:
      return Network.MATIC_MUMBAI;
    default:
      return Network.ETH_MAINNET;
  }
};

interface SliderSelectorProps {
  onClickOption: (option: string) => void;
}

interface SelectorOptions {
  label: string;
  selected: boolean;
  value: string;
}

function SliderSelector({ onClickOption }: SliderSelectorProps) {
  const [options, setOptions] = useState<SelectorOptions[]>([
    {
      label: 'Collectables',
      selected: true,
      value: 'collectables',
    },
    {
      label: 'Coins',
      selected: false,
      value: 'coins',
    },
  ]);

  return (
    <Box
      borderRadius="connectButton"
      display="block"
      marginTop="10"
      paddingX="8"
      paddingY="12"
      style={{ 'background-color': '#F0F0F0' }}
      width="full"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        height="full"
        justifyContent="center"
        style={{ left: 0, top: 0 }}
        width="full"
      >
        {options.map((option, index) => {
          return (
            <Box
              alignItems="center"
              cursor="pointer"
              display="flex"
              height="full"
              justifyContent="center"
              key={index}
              onClick={() => {
                setOptions(
                  options.map((o, i) => {
                    return {
                      ...o,
                      selected: i === index,
                    };
                  })
                );

                onClickOption(option.value);
              }}
              width="full"
            >
              <Text
                color={option.selected ? 'accentColor' : 'modalTextSecondary'}
                weight="semibold"
              >
                {option.label}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export function ProfileDetails({
  address,
  balanceData,
  ensAvatar,
  ensName,
  onClose,
  onDisconnect,
}: ProfileDetailsProps) {
  const showRecentTransactions = useContext(ShowRecentTransactionsContext);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [assetsCategory, setAssetsCategory] = useState<
    'coins' | 'collectables'
  >('collectables');
  const [nftMetadata, setNftMetadata] = useState<OwnedNftsResponse>();
  const [coinsMetadata, setCoinsMetadata] = useState<CoinMetadata[]>([]);
  const { connector } = useAccount();
  const [screen, setScreen] = useState('list' as 'list' | 'details');
  const [selectedAsset, setSelectedAsset] = useState<OwnedNft[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<AssetListProps | null>(null);

  useEffect(() => {
    // TODO: add useProfileDetails hook to fetch chain data
    async function getChainConfig(): Promise<Alchemy> {
      const selectedChain = await connector?.getChainId();

      const config = {
        apiKey: 'pZeNwDzPr46JgI5oGyuEoobufgMp2Co0',
        network: getNetworkById(selectedChain ?? 1),
      };

      const alchemy = new Alchemy(config);

      return alchemy;
    }

    async function fetchCoins() {
      setLoading(true);

      let coinsMetadata: CoinMetadata[] = [];
      let alchemy = await getChainConfig();
      const balances = await alchemy.core.getTokenBalances(address);

      const nonZeroBalances = balances.tokenBalances.filter(token => {
        return token.tokenBalance !== '0';
      });

      for (let token of nonZeroBalances) {
        let balance = parseInt(token.tokenBalance ?? '0');

        const metadata = await alchemy.core.getTokenMetadata(
          token.contractAddress
        );

        // Compute token balance in human-readable format
        balance = balance / Math.pow(10, metadata.decimals ?? 6);

        coinsMetadata.push({
          address: token.contractAddress,
          balance: balance.toFixed(2),
          logo: metadata.logo ?? '',
          name: metadata.name ?? 'Unnamed',
          symbol: metadata.symbol ?? 'UNK',
        });
      }

      setLoading(false);
      setCoinsMetadata(coinsMetadata);
    }

    async function fetchNFTs() {
      setLoading(true);

      let alchemy = await getChainConfig();
      const nfts = await alchemy.nft.getNftsForOwner(address);

      setLoading(false);
      setNftMetadata(nfts);
    }

    fetchCoins();
    fetchNFTs();
  }, []);

  const copyAddressAction = useCallback(() => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
    }
  }, [address]);

  useEffect(() => {
    if (copiedAddress) {
      const timer = setTimeout(() => {
        setCopiedAddress(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [copiedAddress]);

  if (!address) {
    return null;
  }

  const accountName = ensName ? formatENS(ensName) : formatAddress(address);
  const ethBalance = balanceData?.formatted;
  const displayBalance = ethBalance
    ? abbreviateETHBalance(parseFloat(ethBalance))
    : undefined;
  const titleId = 'rk_profile_title';
  const mobile = isMobile();

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Box background="profileForeground" padding="16">
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            gap={mobile ? '16' : '12'}
            justifyContent="center"
            margin="8"
            style={{ textAlign: 'center' }}
          >
            <Box
              style={{
                position: 'absolute',
                right: 16,
                top: 16,
                willChange: 'transform',
              }}
            >
              <CloseButton onClose={onClose} />
            </Box>{' '}
            <Box display="flex" flexDirection="row">
              <Box marginTop={mobile ? '24' : '0'}>
                <Avatar
                  address={address}
                  imageUrl={ensAvatar}
                  size={mobile ? 82 : 74}
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                gap={mobile ? '4' : '0'}
                justifyContent="center"
                marginLeft="20"
                textAlign="center"
              >
                <Box textAlign="center">
                  <Text
                    as="h1"
                    color="modalText"
                    id={titleId}
                    size={mobile ? '20' : '18'}
                    weight="heavy"
                  >
                    {accountName}
                  </Text>
                </Box>
                {balanceData && (
                  <Box textAlign="center">
                    <Text
                      as="h1"
                      color="modalTextSecondary"
                      id={titleId}
                      size={mobile ? '16' : '14'}
                      weight="semibold"
                    >
                      {displayBalance} {balanceData.symbol}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {screen === 'list' && (
            <Box>
              <SliderSelector
                onClickOption={option =>
                  setAssetsCategory(option as 'coins' | 'collectables')
                }
              />
            </Box>
          )}

          {screen === 'details' && (
            <>
              {selectedCollection && (
                <SelectedAssetIcon
                  item={selectedCollection}
                  onClick={() => {
                    setScreen('list');
                  }}
                />
              )}
            </>
          )}

          <Box
            background="generalBorder"
            height="1"
            marginY="10"
            width="full"
          />

          <Box marginTop="10">
            {screen === 'list' && (
              <div style={{ height: '200px', overflow: 'auto' }}>
                {loading && (
                  <Box
                    alignItems="center"
                    color="accentColor"
                    display="flex"
                    height="full"
                    justifyContent="center"
                    width="full"
                  >
                    <SpinnerIcon />
                  </Box>
                )}

                {assetsCategory === 'collectables' && (
                  <>
                    {nftMetadata?.ownedNfts !== undefined &&
                      nftMetadata?.ownedNfts.length > 0 && (
                        <AssetListItem
                          items={mapCollectionsToAssets(nftMetadata?.ownedNfts)}
                          onClick={(item: AssetListProps) => {
                            const nfts = nftMetadata.ownedNfts.filter(
                              nft => nft.contract.address === item.address
                            );

                            setSelectedCollection(item);
                            setSelectedAsset(nfts);
                            setScreen('details');
                          }}
                        />
                      )}
                  </>
                )}

                {assetsCategory === 'coins' && (
                  <>
                    {coinsMetadata.length > 0 && (
                      <AssetListItem items={mapCoinsToAssets(coinsMetadata)} />
                    )}
                  </>
                )}
              </div>
            )}

            {screen === 'details' && (
              <Box
                scrolling="true"
                style={{ height: '200px', overflowY: 'auto' }}
              >
                <div
                  style={{
                    'display': 'grid',
                    'grid-gap': '2px',
                    'grid-template-columns': 'repeat(3, 1fr)',
                  }}
                >
                  {selectedAsset?.map(asset => (
                    <div
                      key={asset.tokenId}
                      style={{
                        'background-image': `url(${asset.media[0].thumbnail})`,
                        'background-position': 'center',
                        'background-size': 'cover',
                        'border': '1px solid #E5E5E5',
                        'border-radius': '13px',
                        'flex': '1',
                        'height': '100px',
                        'width': '100px',
                      }}
                    />
                  ))}
                </div>
              </Box>
            )}
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="8"
            margin="2"
            marginTop="16"
          >
            <ProfileDetailsAction
              action={copyAddressAction}
              icon={copiedAddress ? <CopiedIcon /> : <CopyIcon />}
              label={copiedAddress ? 'Copied!' : 'Copy Address'}
            />
            <ProfileDetailsAction
              action={onDisconnect}
              icon={<DisconnectIcon />}
              label="Disconnect"
              testId="disconnect-button"
            />
          </Box>
        </Box>
        {showRecentTransactions && (
          <>
            <Box background="generalBorder" height="1" marginTop="-1" />
            <Box>
              <TxList address={address} />
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
