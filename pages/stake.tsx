import type { NextPage } from 'next'
import Link from 'next/link';
import Head from 'next/head'


const Stake: NextPage = () => {


    return (
        <>
            <Head>
                <title>MGH - Staking</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
            </Head>


            <div className="flex items-stretch w-full h-full self-center">
                <Link href="/stake-ethereum">
                    <a className="flex flex-col w-1/2 items-center p-3 xs:p-5 text-center justify-center space-y-2 hover:bg-grey-darkest hover:bg-opacity-20 rounded-xl">
                        <img src="/images/ethereum-eth-logo.png" className="h-18 sm:h-24 w-auto mb-8" />
                        <p className="text-gray-200 text-xl sm:text-3xl font-medium">Ethereum Staking</p>
                        <p className="text-gray-400 text-sm sm:text-xl">bonded staking, fixed APY, 4 different Pools</p>
                    </a>
                </Link>

                <hr className="border-opacity-20 border-0.5 h-3/4 self-center" />

                <Link href="/stake-polygon">
                    <a className="flex flex-col w-1/2 items-center p-3 xs:p-5 text-center justify-center space-y-2 hover:bg-grey-darkest hover:bg-opacity-20 rounded-xl">
                        <img src="/images/polygon-matic-logo.png" className="h-18 sm:h-24 w-auto mb-8" />
                        <p className="text-gray-200 text-xl sm:text-3xl font-medium">Polygon Staking</p>
                        <p className="text-gray-400 text-sm sm:text-xl">unbonded staking, variable APY</p>
                    </a>
                </Link>
            </div>

        </>
    )
}

export default Stake
