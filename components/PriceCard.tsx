import { FiExternalLink } from "react-icons/fi"

const PriceCard = ({ showCard, processing, name, imageLink, openseaLink, sandboxLink, tokenID, ethPrice, sandPrice, usdPrice }: any) => {
    return (



        <div className={`${showCard ? "animate__fadeIn" : "hidden"} ${processing && "animate__fadeOut"} animate__animated relative w-full h-full space-x-10 flex flex-row items-center`}>
            <div className="flex flex-col">
                <a href={sandboxLink} target="_blank" className="relative w-36 h-36">
                    <img src={imageLink} className="rounded-md object-cover" />
                    <FiExternalLink className="absolute top-0 right-0 text-white text-xs backdrop-filter backdrop-blur-sm rounded-xl w-6 h-6 p-1" />
                </a>
                <p className="text-2xl font-bold text-gray-200 pt-3">
                    {name}
                </p>
                <p className="text-xs text-gray-400 pb-3">
                    Token ID: {tokenID}
                </p>
                <div className="flex space-x-5 items-center">
                    <a href={openseaLink} target="_blank" className="flex items-center max-w-max space-x-1 text-gray-200 text-xxs xl:text-sm hover:text-blue-400 transition duration-300 ease-in-out" >
                        <p className="font-medium">Opensea</p>
                        <FiExternalLink className="mb-0.5" />
                    </a>
                    <a href={openseaLink} target="_blank" className="flex items-center max-w-max space-x-1 text-gray-300 text-xxs xl:text-sm hover:text-blue-400 transition duration-300 ease-in-out" >
                        <p className="font-medium">Sandbox</p>
                        <FiExternalLink className="mb-0.5" />
                    </a>
                </div>

            </div>

            <div className="flex flex-col self-start  space-y-">
                <p className="text-gray-200 font-medium pb-1 w-full px-4">
                    Price Estimation:
                </p>

                <div className="flex space-x-4 items-center w-full justify-start px-4 py-2 h-full">
                    <img src="/images/ethereum-eth-logo.png" className="rounded-full h-10 w-10  p-1 shadow-button" />
                    <p className="text-2xl font-medium text-gray-300 pt-0.5">
                        {ethPrice} <span className="font-light text-xl">ETH</span>
                    </p>
                </div>
                <div className={`flex ${!sandPrice && "invisible"} space-x-4 items-center w-full justify-start px-4 py-2 h-full`}>
                    <img src="/images/the-sandbox-sand-logo.png" className="rounded-full h-10 w-10  p-1 shadow-button" />
                    <p className="text-2xl font-medium text-gray-300 pt-0.5">
                        {sandPrice} <span className="font-light text-xl">SAND</span>
                    </p>
                </div>
                <div className={`flex ${!usdPrice && "invisible"} space-x-4 items-center w-full justify-start px-4 py-2 h-full`}>
                    <img src="/images/usd-coin-usdc-logo.png" className="rounded-full h-10 w-10  p-1 shadow-button" />
                    <p className="text-2xl font-medium text-gray-300 pt-0.5">
                        {usdPrice} <span className="font-light text-xl">USDC</span>
                    </p>
                </div>
            </div>

        </div>
    )
}

export default PriceCard


