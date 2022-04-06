import React, { useEffect, useState, useRef, SetStateAction } from "react";
import { Metaverse } from "../../lib/enums";
import { createChart, SingleValueData } from "lightweight-charts";
import { getValuationDailyData } from "../../lib/FirebaseUtilities";

interface IChartValues {
  time: number;
  dailyVolume: {
    ethPrediction: number;
    usdPrediction: number;
    metaversePrediction: number;
  }[];
  floorPrice: {
    ethPrediction: number;
    usdPrediction: number;
    metaversePrediction: number;
  }[];
}
interface ISymbol {

}

const FloorAndVolumeChart = ({ metaverse }: { metaverse: Metaverse }) => {
  const metaverseGraph = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<IChartValues[]>([]);
  const [symbol, setSymbol] = useState<string>("ETH");
  const metaverseSymbols = {
    sandbox: "SAND",
    decentraland: "MANA",
    "axie-infinity": "AXS",
  };
  const symbolKeys = {ETH:"ethPrediction",USDC:"usdPrediction",[metaverseSymbols[metaverse]]:"metaversePrediction"}
  const symbols = ["ETH", "USDC", metaverseSymbols[metaverse]];

  useEffect(() => {
    (async () => setValues(await getValuationDailyData(metaverse)))();
  }, [metaverse]);

  useEffect(() => {
    const chart = createChart(metaverseGraph.current as HTMLElement, {
      width: metaverseGraph.current?.clientWidth,
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
      title: "Daily Volume",
    });

    const volumeSeries = chart.addHistogramSeries({
      color: "#26a69a",
      title: "Floor Price",
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
      values.map((data: IChartValues) => {
        return {
          time: new Date(data.time) as any / 1000,
          value:
            data.dailyVolume[
              symbolKeys[symbol]
            ],
        } as SingleValueData;
      })
    );
    volumeSeries.setData(
      values.map((data: IChartValues) => {
        return {
          time: new Date(data.time) as any / 1000,
          value:
            data.floorPrice[
              symbolKeys[symbol]
            ],
        } as SingleValueData;
      })
    );
    const resizeGraph = () =>
      chart.applyOptions({ width: metaverseGraph.current?.clientWidth });
    window.addEventListener("resize", resizeGraph);
    return () => {
      window.removeEventListener("resize", resizeGraph);

      chart.remove();
    };
  }, [values, symbol]);


  return (
    <div className="max-w-full h-full relative" ref={metaverseGraph}>
      <div className="absolute top-1 left-1 z-10 flex gap-2">
        {symbols.map((arrSymbol) => (
          <button
            className={
              "gray-box font-semibold  rounded-lg p-2 text-xs text-gray-400" +
              (symbol === arrSymbol
                ? " text-gray-300 bg-opacity-80 "
                : " hover:text-gray-300 hover:bg-opacity-80")
            }
            onClick={() => setSymbol(arrSymbol)}
          >
            {arrSymbol}
          </button>
        ))}
      </div>
    </div>
  );
};
export default FloorAndVolumeChart;
