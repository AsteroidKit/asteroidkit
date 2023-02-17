# AsteroidKit

**AsteroidsKit** is a react library and platform that makes it easy to do web3 authorization. It adds superpowers to _RainbowKit_ + _Wagmi_ but adds new features like social logins, sign-in with Ethereum out of the box, intuitive configuration, and analytics.

You also do not need to go through the pain of understanding the setup of _Wagmi_. Everything is handled by us.

Please refer to our docs to read more:
https://docs.asteroidkit.com/

## Getting started

In order to get started, everything that you need to do is:

1. Install the library

```
npm install asteroidkit wagmi
```

2. Register at https://www.asteroidkit.com/
3. Wrap the code with the **AsteroidKitProvider**

   ```tsx
   import { AsteroidKitProvider } from "asteroidkit";

   <AsteroidsKitProvider appId="...">
       {Your code}
   </AsteroidsKitProvider>
   ```

You're all set to use all hooks, components, etc!

If you're an existing RainbowKit or Wagmi user, here's a simple guide to start using AsteroidKit:
https://docs.asteroidkit.com/getting-started

**AsteroidsKit** also exposes everything from Rainbowkit and Wagmi, so you have access by doing

```tsx
import { rainbowkit, wagmi } from 'asteroidkit';
```

Your feedback is important to us, please reach out to us at team@asteroidkit.com.
