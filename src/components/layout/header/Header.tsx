import React from "react";
import SolanaWallet from "components/wallet/SolanaWallet";
import StacheNode from "assets/svgs/stach-node.svg";

const Header: React.FC = () => {
    return (
        <header className="mt-8 mx-auto w-full">
            <div className="mx-[30px] flex items-center justify-between max-w-[1300px] md:mx-[100px] 2xl:mx-auto">
                <img src={StacheNode} alt="stach-node" />
                <SolanaWallet />
            </div>
        </header>
    )
};

export default Header;