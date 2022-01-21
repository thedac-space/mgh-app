import { Metaverse } from '../enums'
import { ICoinPrices, IPriceCard } from './valuationTypes'

export const convertETHPrediction = (
  coinPrices: ICoinPrices,
  ethPrediction: number
) => {
  const ethUSD = coinPrices.ethereum.usd
  const sandUSD = coinPrices['the-sandbox'].usd
  const usdPrediction = ethPrediction * ethUSD
  const sandPrediction = usdPrediction / sandUSD
  return { ethPrediction, usdPrediction, sandPrediction }
}

export const convertMANAPrediction = (
  coinPrices: ICoinPrices,
  manaPrediction: number
) => {
  const ethUSD = coinPrices.ethereum.usd
  const manaUSD = coinPrices.decentraland.usd
  const usdPrediction = manaPrediction * manaUSD
  const ethPrediction = usdPrediction / ethUSD
  return { ethPrediction, usdPrediction, manaPrediction }
}

// Get Price Predictions for Single Land Asset
export const getLandPricePredictions = async (
  tokenID: number,
  metaverse: Metaverse
) => {
  try {
    const predictionRes = await fetch('/api/getLandData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenID: tokenID,
        metaverse: metaverse,
      }),
    })
    const data = await predictionRes.json()
    return data
  } catch (e) {
    console.log(e)
  }
}

// Formatting a Land Asset received from OpenSea into our Cards
export const formatLandAsset = async (asset: any, coinPrices: ICoinPrices) => {
  const formattedAsset = {
    apiData: {
      metaverse: Metaverse.SANDBOX,
      name: asset.name,
      opensea_link: asset.permalink,
      external_link: asset.external_link,
      images: { image_url: asset.image_original_url },
      tokenId: asset.token_id,
    },
    showCard: true,
    processing: false,
  }
  const predictions = await getLandPricePredictions(
    formattedAsset.apiData.tokenId,
    formattedAsset.apiData.metaverse
  )

  Object.defineProperty(formattedAsset, 'predictions', {
    value: convertETHPrediction(coinPrices, predictions.prices.predicted_price),
  })
  return formattedAsset as IPriceCard
}

// Fetch Assets from OpenSea. So Far Open Sea returns up to 50 results
export const fetchAssets = async (wallet: string, assetContract: string) => {
  try {
    const res = await fetch(
      `https://api.opensea.io/api/v1/assets?owner=${wallet}&asset_contract_address=${assetContract}&order_direction=desc&offset=0&limit=50`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': '64aa1996f0fa46fcaf35a21f24f2525a',
        },
      }
    )
    return await res.json()
  } catch (e) {
    console.error(e)
  }
}
