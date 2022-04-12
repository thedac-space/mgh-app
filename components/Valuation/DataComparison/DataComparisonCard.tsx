import React from "react";
import { useState, useEffect } from "react";
import { IAPIData, IPredictions } from "../../../lib/types";

interface Props {
  apiData: IAPIData | undefined;
  predictions: IPredictions | undefined;
}

function getMetaverseTokenFromOpenseaLink(opensea_link: string | undefined) {
  let metaverse = "";
  let tokenID = "";
  if (opensea_link) {
    const split = opensea_link.split("/");
    metaverse = split[4];
    tokenID = split[5];
  }
  return { metaverse, tokenID };
}

/**
 * 
 * @param param0 
 * @returns 
 */
const DataComparisonCard = ({ apiData, predictions }: Props) => {
  const [offers, setOffers] = useState<number>();
  const [openseaLink, setOpenSeaLink] = useState<string | undefined>(apiData?.external_link);
  
  const usdPredictionPrice = predictions?.usdPrediction;
  const handleData = async () => {
    let { metaverse, tokenID } = getMetaverseTokenFromOpenseaLink(
      apiData?.opensea_link
    );
    const res = await fetch("/api/getLandOffers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ metaverse: metaverse, tokenId: tokenID }),
    });
    const data = await res.json();
    return data;
  };

  let usdPrice;
  let offerPrice;

  useEffect(() => {
    const data = handleData();
    data
      .then((res) => {
        offerPrice = res.offers[0].current_price;
        offerPrice = parseFloat(offerPrice) / 1000000000000000000;
        usdPrice = res.offers[0].payment_token_contract.usd_price;
        usdPrice = parseFloat(usdPrice) * offerPrice;
        setOffers(usdPrice);
      })
      .catch((err) => console.log(err));
  }, [apiData]);

  let comparisedValue = 0;
  if (usdPredictionPrice && offers) {
    comparisedValue =
      ((offers - usdPredictionPrice) /
        ((usdPredictionPrice + offers) / 2)) *
      100;
    comparisedValue = parseFloat(comparisedValue.toFixed(2));
  }
  const isUnderValued = comparisedValue < 0;

  return (
    <div className="mt-4 text-xl 2xl:text-2xl font-medium text-gray-300 pt-0.5">
      {offers ? (
        <>
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
              <div
                className={isUnderValued ? "text-green-500" : "text-red-500"}
              >
                {comparisedValue}%{" "}
                {isUnderValued ? "undervalued" : "overvalued"}
              </div>
            </li>
          </ul>
        </>
      ) : (
        <>
          <div className="">This land does not have offers :( ...</div>
        </>
      )}
    </div>
  );
};

export default DataComparisonCard;
