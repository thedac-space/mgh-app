import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
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

    return (
        <>
            <Head>
                <title>MGH - Test</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
            </Head>

            <div className="w-full -mb-4 xs:-mb-6 sm:-mb-10 xl:-mb-0 h-full flex flex-col items-center justify-center animate__animated animate__fadeIn animate__slow">
                <PurchaseProvider>
                    <div className='w-full overflow-auto'>
                        <PurchaseOptionButton option={buttonOption}/>
                            <PurchaseActionButton onClick={() => {setButtonOption(1)}} text={"1 Month"}/>
                            <PurchaseActionButton onClick={() => {setButtonOption(3)}} text={"3 Month"}/>
                            <PurchaseActionButton onClick={() => {setButtonOption(12)}} text={"12 Month"}/>
                        <h3 className='text-slate-50'>Este es el Action Button, en si solo recibe una accion a ejecutar y un texto</h3>
                        <PurchaseActionButton onClick={() => { alert("En la accion puse un alert con este mensaje") }} text={"click me"}/>
                        <h3 className='text-slate-50'>Este es el But Form, creo que aun no esta terminado, o no se bien como usarlo, ya que cuando le doy click al button switch to poligon se romple el programa</h3>
                        <PurchaseBuyForm coinValues={coinValueTest}/>
                        <h3 className='text-slate-50'>Esta seccion de botones ya esla ligada al anterior componente gracias a un provider predefinido por Mauro</h3>
                        <PurchaseCoinList/>
                        <h3 className='text-slate-50'>Informacion plasmada, nada funcional</h3>
                        <PurchaseKeyFeatures/>
                        <h3 className='text-slate-50'>este si es funcional, tiene 3 diferentes opciones que las dejo plasmadas en el button de abajo</h3>
                    </div>
                </PurchaseProvider>

            </div>
        </>
    )
}

export default Liquidity
