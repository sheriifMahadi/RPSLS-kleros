import { configureChains, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { alchemyProvider } from 'wagmi/providers/alchemy';

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [sepolia],
    [
        alchemyProvider({
            apiKey: import.meta.env.VITE_APP_ALCHEMY_API_KEY,
        }),
    ],
);

const connector = new MetaMaskConnector({
    chains,
});

export const wagmiconfig = createConfig({
    publicClient,
    webSocketPublicClient,
    connectors: [connector],  
})