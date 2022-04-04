import React, { useEffect, useState, useRef } from "react";
import { Metaverse } from "../../lib/enums";
import { createChart, UTCTimestamp } from "lightweight-charts";
import { getValuationDailyData } from "../../lib/FirebaseUtilities";

const Graph = ({ metaverse }: Metaverse) => {
  const metaverseGraph = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState([]);
  const [symbol, setSymbol] = useState<"ETH" | "USDC" | "Metaverse">("ETH");

  useEffect(() => {
    (async () => setValues(await getValuationDailyData(metaverse)))();
  },[metaverse]);

  useEffect(() => {
    const chart = createChart(metaverseGraph?.current!, {
      width: metaverseGraph?.current!.clientWidth,
      height: 197,
      timeScale: {
        fixLeftEdge: true,
        fixRightEdge: true,
        timeVisible: true,
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
        borderVisible: false,
      },
      layout: {
        backgroundColor: "#131722",
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: {
          color: "rgba(42, 46, 57, 0)",
        },
        horzLines: {
          color: "rgba(42, 46, 57, 0.6)",
        },
      },
    });
    const areaSeries = chart.addAreaSeries({
      topColor: "rgba(38,198,218, 0.56)",
      bottomColor: "rgba(38,198,218, 0.04)",
      lineColor: "rgba(38,198,218, 1)",
      lineWidth: 2,
      title:"Daily Volume"
    });

    const volumeSeries = chart.addHistogramSeries({
      color: "#26a69a",
      title:"Floor Price",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    areaSeries.setData(
      values.map((data) => {
        return {
          time: new Date(data.time) / 1000,
          value:
            data.dailyVolume[
              (symbol === "ETH" && "ethPrediction") ||
                (symbol === "USDC" && "usdPrediction") ||
                (symbol === "Metaverse" && "metaversePrediction")
            ],
        };
      })
    );
    volumeSeries.setData(
      values.map((data) => {
        return {
          time: new Date(data.time) / 1000,
          value:
            data.floorPrice[
              (symbol === "ETH" && "ethPrediction") ||
                (symbol === "USDC" && "usdPrediction") ||
                (symbol === "Metaverse" && "metaversePrediction")
            ],
        };
      })
    );
    const resizeGraph = () =>
      chart.applyOptions({ width: metaverseGraph?.current!.clientWidth! });
    window.addEventListener("resize", resizeGraph);
    return () => {
      window.removeEventListener("resize", resizeGraph);

      chart.remove();
    };
  }, [values, symbol]);
  return (
    <div className="max-w-full h-full relative" ref={metaverseGraph}>
      <div className="absolute top-1 left-1 z-10 flex gap-2">
        <button
          className={"gray-box font-semibold  rounded-lg p-2 text-xs text-gray-400"+(symbol==="ETH"?" text-gray-300 bg-opacity-80 ":" hover:text-gray-300 hover:bg-opacity-80")}
          onClick={() => setSymbol("ETH")}
        >
          ETH
          
        </button>
        <button
          className={"gray-box font-semibold rounded-lg p-2 text-xs text-gray-400"+(symbol==="USDC"?" text-gray-300 bg-opacity-80 ":" hover:text-gray-300 hover:bg-opacity-80")}
          onClick={() => setSymbol("USDC")}
        >
          USDC
        </button>
        <button
          className={"gray-box font-semibold rounded-lg p-2 text-xs text-gray-400"+(symbol==="Metaverse"?" text-gray-300 bg-opacity-80 ":" hover:text-gray-300 hover:bg-opacity-80")}
          onClick={() => setSymbol("Metaverse")}
        >
          {metaverse==="sandbox" && "SAND"||metaverse==="decentraland" && "MANA"||metaverse==="axie-infinity" && "AXS"}
        </button>
      </div>
    </div>
  );
};
export default Graph;
