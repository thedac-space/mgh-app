import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { PriceCard } from '../components'
import useConnectWeb3 from '../backend/connectWeb3'
import { fetchAssets, formatLandAsset } from '../lib/valuation/valuationUtils'
import { ICoinPrices, IPriceCard } from '../lib/valuation/valuationTypes'
import { PriceList } from '../components/General'
import { Metaverse } from '../lib/enums'
import { IPredictions } from '../lib/types'
import { useAppSelector } from '../state/hooks'
import { Contracts } from '../lib/contracts'

const PortfolioPage: NextPage<{ prices: ICoinPrices }> = ({ prices }) => {
  const LAND_CONTRACT_ADDRESS = Contracts.LAND.ETHEREUM_MAINNET.address
  const WALLET = '0x2a9da28bcbf97a8c008fd211f5127b860613922d'
  // const WALLET = '0x7812B090d1a3Ead77B5D8F470D3faCA900A6ccB9'
  const [totalWorth, setTotalWorth] = useState<IPredictions>({
    ethPrediction: 0,
    usdPrediction: 0,
    sandPrediction: 0,
  })
  const [formattedAssets, setFormattedAssets] = useState<IPriceCard[]>([])
  const { web3Provider } = useConnectWeb3()
  const { address } = useAppSelector((state) => state.account)

  useEffect(() => {
    // Requesting and Formatting Assets
    const setPortfolioAssets = async () => {
      // OpenSea API Call
      const { assets: rawAssets } = await fetchAssets(
        WALLET,
        LAND_CONTRACT_ADDRESS
      )

      if (rawAssets.length === 0) {
        console.log('No Assets!')
      } else {
        // Formatting Assets to fit into the Cards
        rawAssets.forEach(async (asset: any) => {
          const formattedAsset = await formatLandAsset(asset, prices)
          console.log(formattedAsset)
          setFormattedAssets((previousState) => [
            ...previousState,
            formattedAsset,
          ])
          setTotalWorth((previousWorth) => {
            return {
              ethPrediction:
                previousWorth.ethPrediction +
                formattedAsset.predictions!.ethPrediction,
              usdPrediction:
                previousWorth.usdPrediction +
                formattedAsset.predictions!.usdPrediction,
              sandPrediction:
                previousWorth.sandPrediction! +
                formattedAsset.predictions!.sandPrediction!,
            }
          })
        })
      }
    }
    setPortfolioAssets()
  }, [WALLET])

  return (
    <section>
      <hgroup className='text-white'>
        <h1>Your Portfolio </h1>
        <div className='flex gap-8'>
          <h3>Total LANDS Owned: {formattedAssets.length}</h3>
          <h3>Total Value Worth: </h3>
          {totalWorth && <PriceList predictions={totalWorth} />}
        </div>
      </hgroup>

      {/* Lands Grid */}
      <ul className='grid grid-cols-3'>
        {formattedAssets.length > 0 &&
          formattedAssets.map(
            ({ apiData, showCard, predictions, processing }) => (
              <PriceCard
                apiData={apiData}
                showCard={showCard}
                predictions={predictions}
                processing={processing}
              />
            )
          )}
      </ul>
    </section>
  )
}

export async function getServerSideProps() {
  const coin = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cthe-sandbox%2Cdecentraland&vs_currencies=usd'
  )
  const prices: ICoinPrices = await coin.json()

  return {
    props: {
      prices,
    },
  }
}

export default PortfolioPage
