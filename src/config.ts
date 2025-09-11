import { mainnet, sepolia } from "wagmi/chains";
import { createConfig, http, webSocket } from "wagmi";

export const config = createConfig({
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

export const webSocketConfig = createConfig({
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: webSocket("wss://sepolia.gateway.tenderly.co"),
    [mainnet.id]: webSocket("wss://mainnet.gateway.tenderly.co"),
  },
});
