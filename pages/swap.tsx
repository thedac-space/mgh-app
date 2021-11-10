import type { NextPage } from 'next'
import Head from 'next/head'


const Swap: NextPage = () => {

    return (
        <>
            <Head>
                <title>MGH - Swap</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
            </Head>

            <div className="w-full -mb-4 xs:-mb-6 sm:-mb-10 xl:-mb-0 h-full flex flex-col items-center justify-center animate__animated animate__fadeIn animate__slow">

                <iframe
                    src="https://app.uniswap.org/#/swap?inputCurrency=0x8765b1a0eb57ca49be7eacd35b24a574d0203656&outputCurrency=ETH&theme=dark"
                    height="600px"
                    width="100%"
                    className="rounded-none xl:rounded-xl shadow-black opacity-80 w-screen h-screen xl:w-full xl:h-full bg-transparent"
                />

            </div>

        </>
    )
}

export default Swap
