import { mainnet, sepolia } from "viem/chains";
import { createConfig, http } from "wagmi";

export const config = createConfig({
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});
