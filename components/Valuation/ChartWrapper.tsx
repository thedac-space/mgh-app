import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import { Metaverse } from "../../lib/enums";
import { IChartValues } from "../../lib/types";
import PriceList from "../General/PriceList";

import { test } from "./data";

const AreaChart = dynamic(() => import("./AreaChart"), {
  ssr: false,
});

const FloorAndVolumeChart = dynamic(() => import("./FloorAndVolumeChart"), {
  ssr: false,
});

let markCap: number | any;
/////////////

const ChartWrapper = ({ metaverse }: { metaverse: Metaverse }) => {
  const [values, setValues] = useState<any>({});
  const [markCap, setMarkCap] = useState<any>("");
  const [richList, setRichList] = useState<any>("");
  const routes = [
    { route: "avgPriceParcel", label: "Average Price per Parcel" },
    { route: "floorPrice", label: "Floor Price" },
    { route: "avgPriceParcelPerArea", label: "Average Price per Area" },
    { route: "maxPrice", label: "Max Price" },
    { route: "totalNumberOfSales", label: "Total Sales" },
    { route: "stdSalesPrices", label: "std Sales Prices" },
    { route: "salesVolume", label: "Sales Volume" },
  ];
  //////////
  const routesA = [
    { route: "richList", label: "Rich List" },
    { route: "mCap", label: "Market Cap" },
  ];
  ///////////
  useEffect(() => {
    const salesVolumeCall = async () => {
      const routesValues: any = {};
      for (let element in routes) {
        routesValues[routes[element]["route"]] = await test(
          metaverse,
          routes[element]["route"]
        );
        (routesValues);
      }
      setValues(routesValues);
      setMarkCap(await test(metaverse, "mCap"));
      setRichList(await test(metaverse, "richList"));
    };
    salesVolumeCall();
  }, [metaverse]);
  return (
    <>
      <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 space-x-0 sm:space-x-5 md:space-x-10 items-stretch justify-between w-full">
        <div className="flex flex-col shadow-blck rounded-xl py-3 px-4 w-full bg-grey-dark bg-opacity-20 ">
          <p className={`text-lg xl:text-xl font-medium text-gray-300 mb-4`}>
            Market Cap:{" "}
          </p>

          <PriceList
            predictions={{ ethPrediction: markCap }}
            metaverse={metaverse}
          />
        </div>
        <div className="flex flex-col justify-between w-full space-y-5 md:space-y-10 lg:space-y-5">
          <div className="flex flex-col shadow-blck rounded-xl py-3 px-4 bg-grey-dark bg-opacity-20">
            
            <p className={`text-lg xl:text-xl font-medium text-cyan-300 mb-8`}>
            Lands held by the top 1% of holders:{" "}
            {parseInt(((richList.pctParcels as number) * 100) as unknown as string)}%
          </p>

          </div>
        </div>
      </div>
      <div className="flex flex-col shadow-blck rounded-xl py-3 px-4 w-full bg-grey-dark bg-opacity-20 ">
        <FloorAndVolumeChart metaverse={metaverse} />
      </div>
      {routes.map((element) => {
        if (values[element["route"]])
          return (
            <AreaChart
              metaverse={metaverse}
              data={values[element["route"]]}
              label={element["label"]}
            />
          );
      })}
    </>
  );
};

export default ChartWrapper;
