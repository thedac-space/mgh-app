import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import { Metaverse } from "../../lib/enums";
import { getValuationDailyData } from "../../lib/FirebaseUtilities";
import { IChartValues, symbolPredictions } from "../../lib/types";
import {doomies} from './floorPrice'
const AreaChart = dynamic(() => import("./AreaChart"), {
  ssr: false,
});

const ChartWrapper = ({ metaverse }: { metaverse: Metaverse }) => {
  const [values, setValues] = useState<IChartValues[]>([]);
  useEffect(() => {
    (async () =>
      setValues(
        (await getValuationDailyData(metaverse)).map((value:any) => {
          return { time: value.time, data: value.dailyVolume };
        })
      ))();
  }, [metaverse]);
  return (
    <>
      <AreaChart
        metaverse={metaverse}
        data={values}
        symbolOptions={{
          ETH: { key: "ethPrediction" },
          USDC: { key: "usdPrediction" },
          METAVERSE: {
            key: "metaversePrediction",
            sandbox: "SAND",
            decentraland: "MANA",
            "axie-infinity": "AXS",
          },
        }}
        label="Daily Volume"
      />
      <AreaChart
        metaverse={metaverse}
        data={doomies as IChartValues[]}
        label="Floor Price"
      />
    </>
  );
};

export default ChartWrapper;
