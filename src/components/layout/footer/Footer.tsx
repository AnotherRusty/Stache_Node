import StacheNode from "assets/svgs/stache-node-logo.svg";
import XIcon from "assets/svgs/x.svg";
import CopyRight from "assets/svgs/copyright.svg";

const Footer = () => {
    return (
        <div className="bg-white p-2">
            <div className="mx-[30px] flex flex-col items-center gap-3 justify-between max-w-[1300px] sm:flex-row md:mx-[100px] 2xl:mx-auto">
                <img src={StacheNode} alt="StacheNodeLogo" />
                <img src={CopyRight} alt="CopyRight" />
                <a href="https://twitter.com/stachenode" target="_blank" rel="noopener noreferrer" className='cursor-pointer'><img src={XIcon} alt="xicon" /></a>
            </div>
        </div>
    )
}

export default Footer;