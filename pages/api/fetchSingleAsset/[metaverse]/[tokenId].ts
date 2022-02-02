import type { NextApiRequest, NextApiResponse } from 'next'

// Fetch Single Asset from Open Sea.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tokenId = req.query.tokenId
  const metaverse = req.query.metaverse
  console.log({ tokenId })
  console.log({ metaverse })
  try {
    const response = await fetch(
      `https://api.opensea.io/api/v1/asset/${metaverse}/${tokenId}/`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.OPENSEA!,
        },
      }
    )
    console.log('response', response)
    const data = await response.json()
    console.log('data', data)
    // Retrieving current price
    // const currentPrice = data.orders[0].current_price

    // This return should be expanded as needed
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json(err)
  }
}
