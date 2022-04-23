export default async function handler(req, res) {
	const tokenID = req.query.tokenID;
	const metaverse = req.query.metaverse;
	const X = req.query.X;
	const Y = req.query.Y;
	const flag = req.query?.flag;
	let response;
	try {
		if (flag) {
      response = await fetch(`https://api.opensea.io/api/v1/asset/${metaverse}/${tokenID}/offers`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-API-KEY": process.env.OPENSEA,
				},
			});
    }
		else if (tokenID) {
				response = await fetch(
					`https://services.itrmachines.com/${metaverse}/predict?tokenId=${tokenID}`,
					{
						method: "GET",
					}
				);
			} else {
				response = await fetch(
					`https://services.itrmachines.com/${metaverse}/predict?x=${X}&y=${Y}`,
					{
						method: "GET",
					}
				);
			}
		
		const data = await response.json();
		res.json({ ...data, metaverse });
	} catch (err) {
		res.status(400).json(err);
	}
}
