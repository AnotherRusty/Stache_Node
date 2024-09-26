import { Connection, PublicKey } from "@solana/web3.js";

export const mainRpc = import.meta.env.VITE_MAIN_RPC_URL
export const devRpc = import.meta.env.VITE_DEV_RPC_URL
export const votePubkey = new PublicKey(import.meta.env.VITE_STACHE_NODE_VOTE_PUBKEY)
export const net: 'mainnet-beta' | 'devnet' = import.meta.env.VITE_NET
export const connection = new Connection(net == 'mainnet-beta' ? mainRpc : devRpc, 'confirmed');
