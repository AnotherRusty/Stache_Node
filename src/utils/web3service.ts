import { LAMPORTS_PER_SOL, PublicKey, Keypair, StakeProgram, Authorized, Lockup, Transaction } from '@solana/web3.js'
import { connection, votePubkey } from 'config/index'
import { StakeInfo } from './type'

export const stakeSol = async (stakeAmount: number, walletAddr: PublicKey, validatorPubkey: PublicKey) => {
    /**
     * Please reach out to me for your project
     */
}

export const unstakeSol = async (unstakeAmount: number, walletAddr: PublicKey, stakePubkey: PublicKey) => {
    /**
     * Please reach out to me for your project
     */
}

export const getStakedList = async (walletAddr: PublicKey) => {
    /**
     * Please reach out to me for your project
     */
}

export const getEpochTimeRemaining = async () => {
    const SLOT_IN_SECONDS = 440
    const epochInfo = await connection.getEpochInfo()
    const remainingSlots = epochInfo.slotsInEpoch - epochInfo.slotIndex + 1
    const remainingTimeInSeconds = remainingSlots * SLOT_IN_SECONDS
    const currentTime = Date.now()
    const nextEpochTime = new Date(currentTime + remainingTimeInSeconds)
    const day = String(nextEpochTime.getUTCDate()).padStart(2, '0')
    const month = String(nextEpochTime.getUTCMonth() + 1).padStart(2, '0')
    const year = nextEpochTime.getUTCFullYear()
    const hours = String(nextEpochTime.getUTCHours()).padStart(2, '0')
    const minutes = String(nextEpochTime.getUTCMinutes()).padStart(2, '0')
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`
    return formattedDate
}