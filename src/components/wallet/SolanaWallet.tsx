import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const SolanaWallet: FC = () => {
  const { setVisible } = useWalletModal();
  const { publicKey, disconnect, connect, wallets } = useWallet();

  return (
    <div className="rounded-lg border cursor-pointer border-white py-1 bg-transparent shadow-btn-inner bg-white text-black group relative">
      {publicKey ? (
        <>
          <div className="flex items-center justify-center text-md gap-2 font-bold hover:text-purple-600 duration-300 text-black px-3 py-1">
            <p>
              {publicKey.toBase58().slice(0, 5)}....
              {publicKey.toBase58().slice(-5)}
            </p>
          </div>
          <div className="w-[139px] absolute -right-[1px] top-[43px] hidden group-hover:block bg-white shadow-lg rounded-xl hover:duration-300 z-[9999]">
            <ul className="rounded-lg bg-grayborder-gray-500 p-2 mt-1">
              <li>
                <div
                  className="flex gap-2 items-end mb-3 text-sm hover:text-purple-600 duration-300 text-black font-bold transition-all"
                  onClick={() => setVisible(true)}
                >
                  <p className="brightness-200" /> Change Wallet
                </div>
              </li>
              <li>
                <button
                  className="flex gap-2 items-end text-sm hover:text-purple-600 duration-300 text-black font-bold transition-all"
                  onClick={disconnect}
                >
                  <p className="brightness-200" /> Disconnect
                </button>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div
          className="bg-white text-black px-2 font-bold hover:text-purple-700 duration-300 transition-all py-1 rounded-md flex items-center justify-center text-md"
          onClick={async () => {
            if (wallets[0].readyState == 'Installed') setVisible(true)
            else await connect()
          }}
        >
          Connect Wallet
        </div>
      )}
    </div>
  );
};

export default SolanaWallet;