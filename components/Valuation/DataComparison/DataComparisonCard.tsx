import React from "react";
import { IAPIData, IPredictions } from "../../../lib/types";
import getRealPrice from "./DataComparisonService";

interface Props {
  apiData: IAPIData | undefined;
  predictions: IPredictions | undefined;
}

const DataComparisonCard = ({ apiData, predictions }: Props) => {
  let realPrice
  if(apiData?.opensea_link) {
    realPrice = getRealPrice(apiData?.opensea_link).then(res => res).catch(err => console.log("ERROR: "+err));
    console.log("realPrice")
    console.log(typeof realPrice)
  }

  realPrice=100
  console.log("REAL PRICE! ")
  console.log(realPrice)

  const usdPredictionPrice = predictions?.usdPrediction;
  const ethPredictionPrice = predictions?.ethPrediction;
  const metaversePredictionPrice = predictions?.metaversePrediction;
  
  let comparisedValue = 0


  if(usdPredictionPrice){
    comparisedValue = usdPredictionPrice - 10
  }
  const isUnderValued = comparisedValue < 0;
  
  return (
    <div className="mt-4">
      {realPrice? 
        <>
          <div className="text-gray-200 font-medium pb-1 w-full">Best offer: {realPrice}</div> 
          <div className={isUnderValued? 'text-green-500':'text-red-500'}>{comparisedValue}% {isUnderValued? "undervalued":"overvalued"}</div>  
        </>
        : 
        <>
          <div className="text-gray-200">Loading...</div>
        </>
      }
      
    </div>
  );
};

export default DataComparisonCard;
