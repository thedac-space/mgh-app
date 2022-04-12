// Fetch Assets from OpenSea. So Far Open Sea returns up to 50 results per request
export default async function getRealPrice(opensea_link: string) {
  try {
    const response = await fetch(
      `${opensea_link}/offers?limit=1`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.OPENSEA!,
        },
      }
    )
    const data = await response.json()
    return data
  } catch (err) {
    return err
  }
}