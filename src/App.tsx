import { useEffect, useState } from 'react'
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Modal } from "react-responsive-modal"
import { CircleSpinner } from "react-spinners-kit"

import Header from 'components/layout/header/Header'
import Footer from 'components/layout/footer/Footer'
import NextEpochTime from 'components/nextEpoch/NextEpochTime'

import "react-responsive-modal/styles.css"
import { TOS } from './constants'
import { connection } from './config'
import { getStakedList, stakeSol, unstakeSol } from 'utils/web3service'
import { toastError, toastSuccess } from 'utils/toast'
import { StakeInfo } from 'utils/type'
import { Aero, GroupIcon, Moustache, SolanaFoundation, SolanaIcon, WalletIcon, CheckIcon } from 'assets/svgs'

export default function App() {
  const { setVisible } = useWalletModal()
  const wallet = useWallet()
  const anchorWallet = useAnchorWallet()
  const [stake, setStake] = useState<boolean>(true)
  const [agree, setAgree] = useState<boolean>(false)
  const [stakeAccountList, setStakeAccountList] = useState<Array<StakeInfo>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [unstakeModal, setUnstakeModal] = useState<boolean>(false)
  const [stakeAmount, setStakeAmount] = useState<number | null>()
  const [stakedBalance, setStakedBalance] = useState<number>(0)
  const [unstakeNumber, setUnstakeNumber] = useState<number>(0)
  const [unstakeAmount, setUnstakeAmount] = useState<number>(0)
  const [balance, setBalance] = useState<number>(0)
  const [unStakeLoading, setUnstakeLoading] = useState<boolean>(false)

  const handleMax = () => {
    setStakeAmount(balance)
  }

  const handleStake = async () => {
    if (!stakeAmount) toastError('Input stake amount!')
    else if (stakeAmount > balance) toastError('Exceed balance!')
    else setOpen(true)
  }

  const handleUnstake = async () => {
    if (anchorWallet && wallet && wallet.signTransaction && wallet.publicKey) {
      try {
        setUnstakeLoading(true)
        setUnstakeModal(false)
        const unstakeSolTx = await unstakeSol(unstakeAmount, wallet.publicKey, new PublicKey(stakeAccountList[unstakeNumber].address))
        const stx = await anchorWallet.signTransaction(unstakeSolTx.tx)
        const txId = await connection.sendRawTransaction(stx.serialize(), { skipPreflight: true, maxRetries: 0 })
        await connection.confirmTransaction(txId, "confirmed")
        setUnstakeLoading(false)
        setUnstakeModal(false)
        setUnstakeNumber(0)
        toastSuccess('Success!')
      } catch (e) {
        console.log(e)
        setUnstakeLoading(false)
        setUnstakeModal(false)
        toastError('Unstake failed')
      }
    }
  }

  const handleOK = async () => {
    setOpen(false)
    setAgree(false)
    if (!stakeAmount) return
    if (anchorWallet && wallet && wallet.signTransaction && wallet.publicKey) {
      try {
        setLoading(true)
        const stakeSolTx = await stakeSol(stakeAmount, wallet.publicKey, wallet.publicKey)
        const stx = await anchorWallet.signTransaction(stakeSolTx.tx)
        const txId = await connection.sendRawTransaction(stx.serialize(), { skipPreflight: true, maxRetries: 0 })
        await connection.confirmTransaction(txId, "confirmed")
        setLoading(false)
        setStakeAmount(null)
        toastSuccess('Success!')
      } catch (e) {
        console.log(e)
        setLoading(false)
        toastError('Stake failed')
      }
    }
  }

  useEffect(() => {
    (async () => {
      try {
        if (wallet.publicKey) {
          const balance = await connection.getBalance(wallet.publicKey)
          setBalance(Number((balance / LAMPORTS_PER_SOL).toFixed(4)))
          const stakeInfo = await getStakedList(wallet.publicKey)
          setStakedBalance(Number(stakeInfo.totalStake.toFixed(4)))
          setStakeAccountList(stakeInfo.list)
        } else {
          setBalance(0)
          setStakedBalance(0)
          setStakeAccountList([])
          setUnstakeNumber(0)
        }
      } catch (err) {
        console.log('Failed to fetch wallet balance', err)
      }
    })()
  }, [wallet.publicKey, unStakeLoading, loading])

  return (
    <div className='min-h-[100vh] flex flex-col justify-between'>
      <Header />
      <div className="mx-[30px] py-[60px] grid grid-flow-row grid-cols-1 max-w-[1300px] md:mx-[100px] xl:grid-cols-2 2xl:mx-auto">
        <div className='flex flex-col gap-[30px] text-white text-center justify-center items-center sm:text-left sm:justify-start sm:items-start'>
          <p className='text-[32px] font-bold not-italic leading-[110%] -tracking-[1.3px] md:text-[64px]'>I mu<span className="bg-white text-black">stache</span> you a question. <br />Do you <span className="bg-white text-black">node</span> the answer?</p>
          <div>
            <p className='text-[16px] font-normal not-italic leading-[130%] -tracking-[0.36px] md:text-[18px]'>Stache Node is a Solana Validator run by two stached-up mf's who are deeply engrained in the Solana eco.</p>
            <br />
            <p className='text-[16px] font-normal not-italic leading-[130%] -tracking-[0.36px] md:text-[18px]'>Stake with us for top APY and support honest operators looking to improve the network and support public goods initiatives.</p>
          </div>
          <div className='flex flex-col gap-[30px] sm:flex-row'>
            <a href="https://solana.org/" target="_blank" rel="noopener noreferrer" className='cursor-pointer'><img src={SolanaFoundation} alt="solana foundation" /></a>
            <a href="https://www.aeropool.io/" target="_blank" rel="noopener noreferrer" className='cursor-pointer'><img src={Aero} alt="aero" /></a>
            <a href="https://twitter.com/MoustacheDAO" target="_blank" rel="noopener noreferrer" className='cursor-pointer'><img src={Moustache} alt="moustache dao" /></a>
          </div>
        </div>
        {/* -----------Start Staking and Unstaking window ------------------- */}

        <div className='mt-[80px] flex flex-row justify-center items-center font-bold xl:mt-0 xl:justify-end'>
          <div className='w-[463px] h-[460px] p-6 flex flex-col justify-between gap-4 rounded-2xl bg-white relative'>
            <div className="absolute top-4 right-6 flex items-center justify-center gap-1 z-40">
              <span className={`text-black ${stake ? 'font-bold' : 'font-medium'} uppercase text-md`}>Stake</span>
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={() => setStake(!stake)}
                />
                <span className="slider"></span>
              </label>
              <span className={`text-black ${!stake ? 'font-bold' : 'font-medium'}  uppercase text-md`}> Unstake</span>
            </div>{" "}
            <div className='flex flex-col gap-5'>
              <div className='pt-[56px] flex flex-row justify-between'>
                <p className=' text-[16px] not-italic leading-[120%] -tracking-[0.32px]'>SOL Balance</p>
                <div className='flex flex-row gap-4 items-center justify-between'>
                  <div className='flex flex-row gap-1 items-center'>
                    <img src={WalletIcon} alt="walleticon" />
                    <p className='text-[16px] not-italic leading-[120%] -tracking-[0.32px]'>{balance} SOL</p>
                  </div>
                </div>
              </div>
              <div className='flex flex-row justify-between'>
                <p className=' text-[16px] not-italic leading-[120%] -tracking-[0.32px]'>Staked SOL</p>
                <div className='flex flex-row gap-4 items-center justify-between'>
                  <div className='flex flex-row gap-1 items-center'>
                    <img src={WalletIcon} alt="walleticon" />
                    <p className='text-[16px] not-italic leading-[120%] -tracking-[0.32px]'>{stakedBalance} SOL</p>
                  </div>
                </div>
              </div>
            </div>
            {
              stake ? (
                <>
                  <div className='flex flex-row p-2 justify-between items-center rounded-[6px] border-[1.5px] border-solid border-black'>
                    <div className='flex flex-row items-center gap-2'>
                      <img src={SolanaIcon} alt="solanaicon" />
                      <p className='text-[20px] not-italic font-semibold leading-[120%] -tracking-[0.36px]'>SOL</p>
                    </div>
                    <div className="flex items-center justify-between rounded-lg p-2 gap-4 z-[1]">
                      <input
                        className="w-full outline-none text-[18px] bg-transparent h-full text-black text-right font-bold"
                        placeholder="0"
                        disabled={loading}
                        type="number"
                        step={0.0001}
                        min={0}
                        onChange={(e) => setStakeAmount(Number(e.target.value))}
                        value={stakeAmount == null ? "" : stakeAmount}
                      />
                      <button className='text-[16px] not-italic font-bold leading-[120%] -tracking-[0.32px]' onClick={handleMax}>MAX</button>
                    </div>
                  </div>
                  <div className='flex justify-center items-center'>
                    <img src={GroupIcon} alt="groupicon" />
                  </div>
                  <div>
                    <div className="rounded-[6px] bg-black cursor-pointer shadow-btn-inner text-white group">
                      {wallet.publicKey ? (
                        <div>
                          <button className='w-full bg-black text-white text-[18px] px-2 font-bold hover:text-purple-700 duration-300 transition-all py-2 rounded-md flex items-center justify-center text-md' disabled={loading} onClick={handleStake}>
                            {!loading ? 'Stake' : <CircleSpinner size={26} color="#fff" loading={loading} />}
                          </button>
                        </div>
                      ) : (
                        <div
                          className="bg-black text-white text-[18px] px-2 font-bold hover:text-purple-700 duration-300 transition-all py-2 rounded-md flex items-center justify-center text-md"
                          onClick={async () => {
                            if (wallet.wallets[0].readyState == 'Installed') setVisible(true)
                            else await wallet.connect()
                          }}
                        >
                          Connect Wallet
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-row justify-between'>
                      <p className='text-[16px] not-italic font-bold leading-[120%] -tracking-[0.32px]'>APY</p>
                      <p className='text-[16px] not-italic font-bold leading-[120%] -tracking-[0.32px]'>7.22%</p>
                    </div>
                    <div className='flex flex-row justify-between'>
                      <p className='text-[16px] not-italic font-bold leading-[120%] -tracking-[0.32px]'>Priority Fee</p>
                      <p className='text-[16px] not-italic font-bold leading-[120%] -tracking-[0.32px]'>Yes</p>
                    </div>
                    <div className='flex flex-row justify-between'>
                      <p className='text-[16px] not-italic font-bold leading-[120%] -tracking-[0.32px]'>Next Epoch (approx.)</p>
                      <NextEpochTime />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='flex justify-center items-center'>
                    <img src={GroupIcon} alt="groupicon" />
                  </div>
                  <div className='h-[400px] overflow-auto flex gap-1 flex-col border border-solid p-1 rounded-lg border-black'>
                    {
                      (!stakeAccountList.length || !wallet) ? <p className='mt-[100px] text-center'>No Stake Account</p> : (
                        stakeAccountList.map((val, idx) => {
                          return (
                            <div className='border border-solid rounded-md border-black p-2 flex justify-between items-center' key={idx}>
                              {val.address.slice(0, 4)} .... {val.address.slice(-4)} : {val.amount} SOL
                              <button className='bg-black rounded-md text-white px-2 py-1 w-[100px] flex justify-center hover:text-purple-700 duration-300 transition-all' onClick={() => {
                                setUnstakeNumber(idx)
                                setUnstakeModal(true)
                                setUnstakeAmount(stakeAccountList[idx].amount)
                              }}
                                disabled={unStakeLoading}
                              >{unStakeLoading && unstakeNumber == idx ? <CircleSpinner size={24} color="#fff" loading={unStakeLoading} /> : "Unstake"}</button>
                            </div>
                          )
                        })
                      )
                    }
                  </div>
                </>
              )
            }
          </div>
        </div>

        {/* -----------End Staking and Unstaking window ------------------- */}
      </div>
      <Footer />
      <Modal open={open} onClose={() => setOpen(false)} center>
        <div className='bg-white text-black my-5 '>
          <h1 className='text-center font-bold text-[20px]'>Terms of Service for Stache Node Solana Validator Staking</h1>
          <br />
          <div className='max-h-[70vh] overflow-y-auto'>
            {TOS.map((section, index) =>
            (<div key={`section-${index}`} style={{ marginBottom: '20px' }}>
              {Object.entries(section).map(([key, values]) =>
              (
                <div key={`entry-${key}`}>
                  <br />
                  <h2 className='font-medium text-[20px] mb-2'>{key}</h2>
                  {Array.isArray(values) && values.map((value, i) => (<h3 key={`value-${index}-${i}`} className='text-[18px]'>{value}</h3>))}
                </div>
              )
              )} </div>))}
            <div className='pb-4 flex items-center text-[20px] cursor-pointer select-none font-bold' onClick={() => setAgree((agree) => !agree)}>
              <div className='border border-solid rounded-md w-[32px] h-[32px] mr-2 border-purple-700'>
                {agree && <img src={CheckIcon} alt="check-icon" width={30} height={30} />}
              </div>
              <p className={`text-purple-700`}>
                Agree to the Stache Node's Terms of Service
              </p>
            </div>
          </div>
          <button className={`text-[18px] font-bold w-full p-2 text-center bg-black text-white rounded-lg duration-300 transition-all ${agree ? 'hover:text-purple-700' : 'cursor-not-allowed'}`} onClick={handleOK} disabled={!agree}>OK</button>
        </div>
      </Modal>
      {stakeAccountList.length > 0 &&
        <Modal open={unstakeModal} onClose={() => setUnstakeModal(false)} center>
          <div className='bg-white text-black my-5 flex flex-col gap-4'>
            <div className='max-h-[70vh] overflow-y-auto font-bold flex flex-col gap-4'>
              <p>Stake Account: {stakeAccountList[unstakeNumber].address}</p>
              <p>Balance: {stakeAccountList[unstakeNumber].amount}</p>
            </div>
            <button className='flex justify-center text-[18px] font-bold w-full p-2 bg-black text-white rounded-lg hover:text-purple-700 duration-300 transition-all' disabled={!unstakeAmount || unstakeAmount > stakeAccountList[unstakeNumber].amount || unStakeLoading} onClick={handleUnstake}>
              OK
            </button>
          </div>
        </Modal>
      }
    </div>
  )
}