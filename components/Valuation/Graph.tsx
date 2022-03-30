import React, { useEffect, useState } from "react";
import { Metaverse } from "../../lib/enums";
import { createChart, isUTCTimestamp, UTCTimestamp } from "lightweight-charts";
import { getValuationDailyData } from "../../lib/FirebaseUtilities";

const Graph = ({ metaverse }: Metaverse) => {
  const [values, setValues] = useState([]);
  const [chart, setChart] = useState(null);
  useEffect(() => {
    setChart(
      createChart(document.getElementById("metaverseGraph"), {
        width: 864,
        height: 197,
        localization: {
          timeFormatter: (time: UTCTimestamp) => {
            const date = new Date(time * 1000);

            return (
              date.getFullYear() +
              "-" +
              (date.getMonth() + 1) +
              "-" +
              date.getDate() +
              " " +
              date.getHours() +
              ":" +
              date.getMinutes()
            );
          },
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
      })
    );
    (async () => setValues(await getValuationDailyData(metaverse)))();
  }, []);
  if (chart) {
    let areaSeries = chart.addAreaSeries({
      topColor: "rgba(38,198,218, 0.56)",
      bottomColor: "rgba(38,198,218, 0.04)",
      lineColor: "rgba(38,198,218, 1)",
      lineWidth: 2,
    });

    let volumeSeries = chart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    console.log(values);
    values.forEach((data) => {
      areaSeries.update({
        time: new Date(data.time) / 1000,
        value: data.dailyVolume.ethPrediction,
      });
      volumeSeries.update({
        time: new Date(data.time) / 1000,
        value: data.floorPrice.ethPrediction,
      });
    });
  }

  return <div id="metaverseGraph"></div>;
};
export default Graph;
