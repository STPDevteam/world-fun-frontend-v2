import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import logo from "@/assets/logo.svg";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";


const connectors = connectorsForWallets(
  [
    {
      groupName: "Smart wallets",
      wallets: [
        () =>
          // todo double check () =>
          coinbaseWallet({
            appName: "World.fun",
            appIcon: logo,
          }),
      ],
    },
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, rabbyWallet, walletConnectWallet, rainbowWallet],
    },
  ],
  {
    appName: "World.fun",
    appDescription: "",
    appUrl: "https://www.world.fun/",
    appIcon: logo,
    projectId: '62111a06ace936ca5ffa263be6734004',
  }
);

export const config = createConfig({
  connectors,
  chains: [base],
  transports: { [base.id]: http() },
  ssr: true, // If your dApp uses server side rendering (SSR)
});