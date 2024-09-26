import {
    PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from '@solana/web3.js';
import { FC } from 'react';

import "@solana/wallet-adapter-react-ui/styles.css";

type Props = {
    readonly children: React.ReactNode;
};

// Mainnet-beta is the actuall mainnet (as of writing)
// const endpoint = clusterApiUrl('mainnet-beta');
const endpoint = clusterApiUrl('devnet');

const wallets = [
    new PhantomWalletAdapter(),
];

const SolanaWalletProvider: FC<Props> = ({ children }) => {
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default SolanaWalletProvider;