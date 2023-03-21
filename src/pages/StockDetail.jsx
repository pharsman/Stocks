import { StockChart } from "../components/StockChart";
import { StockData } from "../components/StockData";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../apis/AxiosInstance";

const formatData = (data) => {
  return data.t.map((el, index) => {
    return {
      x: el * 1000,
      y: Math.floor(data.c[index]) / 100,
    };
  });
};

export const StockDetail = () => {
  const [chartData, setChartData] = useState();
  const { symbol } = useParams();
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const date = new Date();
      const currentTime = Math.floor(date.getTime() / 1000);
      let oneDay;
      if (date.getDay() === 6) {
        oneDay = currentTime - 2 * 24 * 60 * 60;
      }
      if (date.getDay() === 0) {
        oneDay = currentTime - 3 * 24 * 60 * 60;
      } else {
        oneDay = currentTime - 24 * 60 * 60;
      }
      const oneWeek = currentTime - 7 * 24 * 60 * 60;
      const oneYear = currentTime - 365 * 24 * 60 * 60;

      try {
        const resps = await Promise.all([
          axios.get("/stock/candle", {
            params: {
              symbol,
              from: oneDay,
              to: currentTime,
              resolution: 30,
            },
          }),
          axios.get("/stock/candle", {
            params: {
              symbol,
              from: oneWeek,
              to: currentTime,
              resolution: 60,
            },
          }),
          axios.get("/stock/candle", {
            params: {
              symbol,
              from: oneYear,
              to: currentTime,
              resolution: "D",
            },
          }),
        ]);
        setChartData({
          day: formatData(resps[0].data),
          week: formatData(resps[1].data),
          year: formatData(resps[2].data),
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();

    return () => (isMounted = false);
  }, [symbol]);
  return (
    <div>
      {chartData && (
        <div>
          <StockChart chartData={chartData} symbol={symbol} />
          <StockData symbol={symbol} />
        </div>
      )}
    </div>
  );
};
