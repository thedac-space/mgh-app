import { FiExternalLink } from "react-icons/fi"
import { Metaverse } from "../lib/enums"
import { IAPIData, IPredictions } from "../lib/types";
import { ellipseAddress } from "../lib/utilities";

export interface PriceCardProps {
    showCard: boolean;
    processing: boolean;
    apiData: IAPIData | undefined;
    predictions: IPredictions | undefined;
}

const PriceCard = ({ showCard, processing, apiData, predictions }: PriceCardProps) => {

    if (!apiData || !predictions) {
        return (<></>)
    }

    const handleTokenID = (tokenID: number) => {
        if (tokenID.toString().length > 6 ) {
            return ellipseAddress(tokenID.toString(), 3)
        } else {
            return tokenID
        }
    }

    return (
        <div className={`${showCard ? "animate__fadeIn" : "hidden"} ${processing && "animate__fadeOut animate__fast"} animate__animated relative w-full h-full space-y-3 flex flex-col items-center`}>

            <div className="flex flex-col flex-grow min-w-max 2xl:flex-none items-center">
                <a href={apiData.external_link} target="_blank" className="relative w-28 md:w-36 h-28 md:h-36 hover:shadow-dark">
                    <img src={apiData.images.image_url} className="rounded-md object-cover" />
                    <FiExternalLink className="absolute top-0 right-0 text-white text-xs backdrop-filter backdrop-blur-sm rounded-xl w-6 h-6 p-1" />
                </a>
                <p className="text-xl 2xl:text-2xl font-bold text-gray-200 pt-3">
                    {apiData.name}
                </p>
                <p className="text-xs text-gray-400 pb-3">
                    Token ID: {handleTokenID(apiData.tokenId)}
                </p>
                <div className="flex space-x-5 items-center">
                    <a href={apiData.opensea_link} target="_blank" className="flex items-center max-w-max space-x-1 text-gray-200 text-sm hover:text-blue-400 transition duration-300 ease-in-out" >
                        <p className="font-medium">Opensea</p>
                        <FiExternalLink className="mb-0.5" />
                    </a>
                    <a href={apiData.external_link} target="_blank" className="flex items-center max-w-max space-x-1 text-gray-300 text-sm hover:text-blue-400 transition duration-300 ease-in-out" >
                        <p className="font-medium capitalize">{apiData.metaverse}</p>
                        <FiExternalLink className="mb-0.5" />
                    </a>
                </div>

            </div>

            <hr className="block border-gray-500 w-5/6" />

            <div className="flex flex-col self-start flex-grow min-w-max pt-2 pl-5">
                <p className="text-gray-200 font-medium pb-1 w-full">
                    Price Estimation:
                </p>

                <div className={`flex ${!predictions.ethPrediction && "invisible"} space-x-4 items-center w-full justify-start py-2 h-full`}>
                    <img src="/images/ethereum-eth-logo.png" className="rounded-full  h-9 md:h-10 w-9 md:w-10 p-1 shadow-button" />
                    <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                        {predictions.ethPrediction.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="font-light text-lg md:text-xl">ETH</span>
                    </p>
                </div>

                <div className={`flex ${!predictions.usdPrediction && "invisible"} space-x-4 items-center w-full justify-start py-2 h-full`}>
                    <img src="/images/usd-coin-usdc-logo.png" className="rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button" />
                    <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                        {predictions.usdPrediction.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="font-light text-lg md:text-xl">USDC</span>
                    </p>
                </div>

                {apiData.metaverse === Metaverse.SANDBOX && (
                    <div className={`flex ${!predictions.sandPrediction && "invisible"} space-x-4 items-center w-full justify-start py-2 h-full`}>
                        <img src="/images/the-sandbox-sand-logo.png" className="rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button" />
                        <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                            {predictions.sandPrediction?.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="font-light text-lg md:text-xl">SAND</span>
                        </p>
                    </div>
                )}

                {apiData.metaverse === Metaverse.DECENTRALAND && (
                    <div className={`flex ${!predictions.manaPrediction && "invisible"} space-x-4 items-center w-full justify-start py-2 h-full`}>
                        <img src="/images/decentraland-mana-logo.png" className="rounded-full h-9 md:h-10 w-9 md:w-10  p-1 shadow-button" />
                        <p className="text-xl md:text-2xl font-medium text-gray-300 pt-0.5">
                            {predictions.manaPrediction?.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="font-light text-lg md:text-xl">MANA</span>
                        </p>
                    </div>
                )}
            </div>

        </div>
    )
}

export default PriceCard


