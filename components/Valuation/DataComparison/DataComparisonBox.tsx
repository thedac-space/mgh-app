import React from "react";
import { useState, useEffect } from "react";
import { IAPIData, IPredictions } from "../../../lib/types";

interface Props {
  apiData: IAPIData | undefined;
  predictions: IPredictions | undefined;
}

function getAssetData(apiData: IAPIData | undefined) {
  let metaverse = apiData?.metaverse;
  let tokenID: String | undefined;
  if (metaverse != "axie-infinity") {
    tokenID = apiData?.tokenId
  }
  let X = apiData?.coords.x
  let Y = apiData?.coords.y
  return { metaverse, tokenID, X, Y };
}

/**
 * Box that shows comparison of real and prediction price of a land
 * @param {object} { apiData, predictions }
 * @returns
 */
const DataComparisonBox = ({ apiData, predictions }: Props) => {
  const [lastPrice, setLastPrice] = useState<number | undefined>();
  const [showOffer, setShowOffer] = useState<Boolean>(false);
  const usdPredictionPrice = predictions?.ethPrediction;

  const handleData = async (getOffer: Boolean) => {
    let { metaverse, tokenID, X, Y } = getAssetData(apiData);
    let res
    // if getOffer search offers on opensea, else search last sale price on itrm
    if (getOffer) {
      res = await fetch(
        `/api/getLandOffers?metaverse=${metaverse}&tokenID=${tokenID}&flag=${getOffer}`,
        {
          method: "GET",
        }
      );
    }
    // axie infinity needs search by coords
    else if (metaverse == 'axie-infinity') {
      res = await fetch(
        `/api/getLandOffers?metaverse=${metaverse}&X=${X}&Y=${Y}`,
        {
          method: "GET",
        }
      );
    } else {
      res = await fetch(
        `/api/getLandOffers?metaverse=${metaverse}&tokenID=${tokenID}`,
        {
          method: "GET",
        }
      );
    }
    const data = await res.json();
    return data
  };

  useEffect(() => {
    let data = handleData(false);
    data
      .then((res) => {
        let ethPrice = res?.prices?.history[res?.prices?.history.length - 1]?.price
        if (ethPrice) {
          setLastPrice(ethPrice);
        } else {
          setLastPrice(0);
        }
        setShowOffer(false);
      })
      .catch((err) => console.log(err));

    // if we cant retrieve last sale price, we search for best offer
    if (!lastPrice) {
      data = handleData(true)
      data
        .then((res) => {
          let offerPrice = res?.offers[0]?.current_price;
          offerPrice = parseFloat(offerPrice) / 1e18;
          if (offerPrice) {
            setLastPrice(offerPrice);
            setShowOffer(true)
          } else {
            console.log("tgere")
            setLastPrice(0);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [apiData]);

  let comparedValue = 0;
  if (usdPredictionPrice && lastPrice) {
    comparedValue =
      ((lastPrice - usdPredictionPrice) / ((usdPredictionPrice + lastPrice) / 2)) *
      100;
    comparedValue = parseFloat(comparedValue.toFixed(2));
  }
  const isUnderValued = comparedValue < 0;

  return (
    <div className="mt-4 text-xl font-medium text-gray-300 pt-0.5">
      {(lastPrice && !showOffer) ? (
        <ul className="flex flex-col flex-grow min-w-max gap-4">
          <li className="animate-fade-in-slow flex gap-4 items-center w-full justify-start h-full ">
            Last sale price:
            <img
              src="/images/ethereum-eth-logo.png"
              className="rounded-full  h-9 xl:h-10 w-9 xl:w-10 p-1 shadow-button"
              loading="lazy"
            />{" "}
            {lastPrice}
            <span className="font-light text-lg md:text-xl"> ETH</span>
          </li>
          <li className="font-bold">
            <div className={isUnderValued ? "text-green-500" : "text-red-500"}>
              {comparedValue}% {isUnderValued ? "undervalued" : "overvalued"}
            </div>
          </li>
        </ul>
      ) : (
        (lastPrice && showOffer) ?
          <ul>
            <li className="animate-fade-in-slow flex gap-4 items-center w-full justify-start h-full ">
              Best Offer:
              <img
                src="/images/ethereum-eth-logo.png"
                className="rounded-full  h-9 xl:h-10 w-9 xl:w-10 p-1 shadow-button"
                loading="lazy"
              />{" "}
              {lastPrice}
              <span className="font-light text-lg md:text-xl"> ETH</span>
            </li>
          </ul>
          :
          <div>We can't retrieve land's prices :(</div>
      )}
    </div>
  );
};

export default DataComparisonBox;
