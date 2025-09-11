import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import App from "./App.tsx";
import { WagmiProvider } from "wagmi";
import { config } from "./config.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { StatusProvider } from "./providers/StatusProvider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" showRecentTransactions>
          <StatusProvider>
            <App />
          </StatusProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
