import React from "react";
import { useState, useEffect } from "react";
import { IAPIData, IPredictions } from "../../../lib/types";

interface Props {
  apiData: IAPIData | undefined;
  predictions: IPredictions | undefined;
}

function getMetaverseTokenFromLink(apiData: IAPIData | undefined) {
  let opensea_link = apiData?.opensea_link;
  let external_link = apiData?.external_link;
  let metaverse = "";
  let tokenID = "";
  if (opensea_link) {
    const split = opensea_link.split("/");
    metaverse = split[4];
    tokenID = split[5];
  } else if (external_link) {
    // if doesn't have opensea link is Axie Land
    // TODO: implement get prices of axie land
    const split = external_link.split("/");
    const isAxie = split[2].split(".")[1] == "axieinfinity";
    if (isAxie) {
      tokenID = apiData?.tokenId ? apiData?.tokenId : "";
    }
  }
  return { metaverse, tokenID };
}

/**
 * Box that shows comparison of real and prediction price of a land
 * @param {object} { apiData, predictions }
 * @returns
 */
const DataComparisonBox = ({ apiData, predictions }: Props) => {
  const [offers, setOffers] = useState<number>();
  const usdPredictionPrice = predictions?.usdPrediction;
  
  const handleData = async () => {
    let { metaverse, tokenID } = getMetaverseTokenFromLink(apiData);
    const res = await fetch(
      `/api/getLandOffers?metaverse=${metaverse}&tokenId=${tokenID}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    const data = handleData();
    data
      .then((res) => {
        let offerPrice = res.offers[0].current_price;
        offerPrice = parseFloat(offerPrice) / 1e18;
        let usdPrice = res.offers[0].payment_token_contract.usd_price;
        usdPrice = parseFloat(usdPrice) * offerPrice;
        setOffers(usdPrice);
      })
      .catch((err) => console.log(err));
  }, [apiData]);

  let comparedValue = 0;
  if (usdPredictionPrice && offers) {
    comparedValue =
      ((offers - usdPredictionPrice) / ((usdPredictionPrice + offers) / 2)) *
      100;
    comparedValue = parseFloat(comparedValue.toFixed(2));
  }
  const isUnderValued = comparedValue < 0;

  return (
    <div className="mt-4 text-xl font-medium text-gray-300 pt-0.5">
      {offers ? (
        <ul className="flex flex-col flex-grow min-w-max gap-4">
          <li className="animate-fade-in-slow flex gap-4 items-center w-full justify-start h-full ">
            Best offer:
            <img
              src="/images/usd-coin-usdc-logo.png"
              className="rounded-full  h-9 xl:h-10 w-9 xl:w-10 p-1 shadow-button"
              loading="lazy"
            />{" "}
            {offers}
            <span className="font-light text-lg md:text-xl"> USDC</span>
          </li>

          <li className="font-bold">
            <div className={isUnderValued ? "text-green-500" : "text-red-500"}>
              {comparedValue}% {isUnderValued ? "undervalued" : "overvalued"}
            </div>
          </li>
        </ul>
      ) : (
        <div>We can't retrieve land's offers :(</div>
      )}
    </div>
  );
};

export default DataComparisonBox;
