import {
  AsteroidKitProvider,
  ConnectButton,
  createClient,
} from '@rainbow-me/rainbowkit';
import React, { FC } from 'react';
import { WagmiConfig } from 'wagmi';

import './App.css';
import '@rainbow-me/rainbowkit/styles.css';

const client = createClient();

const AppContent: FC = () => {
  return (
    <div>
      <ConnectButton />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <AsteroidKitProvider appId="o1zEwDQ36JUavB">
          <AppContent />
        </AsteroidKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
