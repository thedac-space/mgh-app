/**
 *
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  let metaverse = req.body.metaverse;
  let tokenID = req.body.tokenId;
  const url = `https://api.opensea.io/api/v1/asset/${metaverse}/${tokenID}/offers`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_OPENSEA,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
}
