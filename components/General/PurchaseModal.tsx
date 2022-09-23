import Head from 'next/head'
import { useState } from 'react'
import useConnectWeb3 from '../../backend/connectWeb3'
import {
    PurchaseActionButton,
    PurchaseBuyForm,
    PurchaseCoinList,
    PurchaseKeyFeatures,
    PurchaseOptionButton
} from '../../components/Purchase/index'
import { PurchaseProvider } from '../../components/Purchase/purchaseContext'

const PurchaseModal = ({ onDismiss }: any) => {
    const coinValueTest = {
        ethereum: { usd: 5 },
        wmatic: { usd: 2 },
        "metagamehub-dao": { usd: 1 },
        "usd-coin": { usd: 3 },
        tether: { usd: 4 },
        "ocean-protocol": { usd: 6 },
        "the-sandbox": { usd: 8 },
        decentraland: { usd: 7 }
    }

    const [buttonOption, setButtonOption] = useState<1 | 3 | 12>(12)

    return (
        <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen z-50">
            <div onClick={onDismiss} className="absolute h-full w-full bg-black bg-opacity-40 backdrop-filter backdrop-blur" />
            <div className="z-10 w-[80%] h-[90%] transform scale-85 sm:scale-100 flex flex-col items-stretch shadow-dark text-center p-5 space-y-10 rounded-xl border border-white border-opacity-20 bg-grey-darkest bg-opacity-100 backdrop-filter backdrop-blur-xl text-gray-200 overflow-y-scroll scrollbar--y scrollbar">
                <p className="text-3xl font-medium">Unlock premium Metaverse data tools!</p>
                <PurchaseProvider>
                    <PurchaseOptionButton option={buttonOption} />
                    <div className='flex flex-row gap-5'>
                        <PurchaseActionButton onClick={() => { setButtonOption(1) }} disabled={false} text={"1 Month"} />
                        <PurchaseActionButton onClick={() => { setButtonOption(3) }} disabled={false} text={"3 Month"} />
                        <PurchaseActionButton onClick={() => { setButtonOption(12) }} disabled={false} text={"12 Month"} />
                    </div>
                    <PurchaseKeyFeatures />
                    <PurchaseBuyForm coinValues={coinValueTest} option={buttonOption} />
                    <PurchaseCoinList />
                </PurchaseProvider>
                <p onClick={onDismiss} className="cursor-pointer max-w-max self-center font-medium text-gray-400">Close</p>
            </div>
        </div>
    )

}

export default PurchaseModal