import type { NextPage } from 'next'
import Head from 'next/head'


const Liquidity: NextPage = () => {

    return (
        <>
            <Head>
                <title>MGH - Liquidity</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
            </Head>

            <div className="w-full -mb-4 xs:-mb-6 sm:-mb-10 xl:-mb-0 h-full flex flex-col items-center justify-center animate__animated animate__fadeIn animate__slow">

                <iframe
                    src="https://app.uniswap.org/#/add/v2/0x6B175474E89094C44Da98b954EedeAC495271d0F/0xdAC17F958D2ee523a2206206994597C13D831ec7/theme=dark"
                    height="700px"
                    width="100%"
                    className="rounded-none xl:rounded-xl shadow-black opacity-80 w-screen h-screen xl:w-full xl:h-full bg-transparent"
                />


            </div>

        </>
    )
}

export default Liquidity
