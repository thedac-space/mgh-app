import type { NextApiRequest, NextApiResponse } from 'next'

// Fetch Single Asset from Open Sea.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const address = req.query.address
  try {
    const response = await fetch(
      `https://api.opensea.io/wyvern/v1/orders?taker=${address}&bundled=false&include_bundled=false&limit=50&offset=0&order_by=created_date&order_direction=desc`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.OPENSEA!,
        },
      }
    )
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json(err)
  }
}
