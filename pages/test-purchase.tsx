import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import PurchaseModal from '../components/General/PurchaseModal'
import {
    PurchaseActionButton,
    PurchaseBuyForm,
    PurchaseCoinList,
    PurchaseKeyFeatures,
    PurchaseOptionButton
} from '../components/Purchase/index'
import { PurchaseProvider } from '../components/Purchase/purchaseContext'

const Liquidity: NextPage = () => {
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

    const [buttonOption, setButtonOption] = useState<1 | 3 | 12>(1)
    const [openModal, setOpenModal] = useState<boolean>(false)

    return (
        <>
            <Head>
                <title>MGH - Test</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
            </Head>

            <div className="w-full -mb-4 xs:-mb-6 sm:-mb-10 xl:-mb-0 h-full flex flex-col items-center justify-center animate__animated animate__fadeIn animate__slow">
                {openModal && <PurchaseModal onDismiss={() => setOpenModal(false)}/>}
                <h3 className='text-slate-50'>Activa aqui el Purchasin Modal</h3>
                <PurchaseActionButton onClick={() => { setOpenModal(true) }} text={"click me"} />
            </div>
        </>
    )
}

export default Liquidity
