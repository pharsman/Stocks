import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillCaretDownFill } from "react-icons/bs";
import { BsFillCaretUpFill } from "react-icons/bs";
import { WatchListContext } from "../context/WatchListContext";
import axios from "../apis/AxiosInstance";

export const StockList = () => {
  const [stocks, setStock] = useState([]);
  const { watchList, deleteStock } = useContext(WatchListContext);
  const navigate = useNavigate();

  const changeColor = (change) => {
    return change > 0
      ? "success"
      : change < 0
      ? "danger"
      : change == ""
      ? ""
      : "";
  };
  const renderIcon = (change) => {
    return change > 0 ? (
      <BsFillCaretUpFill />
    ) : change < 0 ? (
      <BsFillCaretDownFill />
    ) : change == "" ? (
      ""
    ) : (
      ""
    );
  };

  const handleStockSelect = (symbol) => {
    navigate(`detail/${symbol}`);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      {
        try {
          const resps = await Promise.all(
            watchList.map((stock) => {
              return axios.get("/quote", {
                params: {
                  symbol: stock,
                },
              });
            })
          );
          const data = resps.map((el) => {
            return {
              data: el.data,
              symbol: el.config.params.symbol,
            };
          });
          if (isMounted) {
            setStock(data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
    return () => (isMounted = false);
  }, [watchList]);

  return (
    <div>
      <table className="table hover mt-5">
        <thead style={{ color: "rgb(79,89,102)" }}>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Last</th>
            <th scope="col">Chg</th>
            <th scope="col">Chg%</th>
            <th scope="col">High</th>
            <th scope="col">Low</th>
            <th scope="col">Open</th>
            <th scope="col">Pclose</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            return (
              <tr
                key={stock.symbol}
                className="table-row"
                style={{ cursor: "pointer" }}
                onClick={() => handleStockSelect(stock.symbol)}
              >
                <th scope="row">{stock.symbol} </th>
                <td className={`text-${changeColor(stock.data.c)}`}>
                  {stock.data.c} {renderIcon(stock.data.c)}
                </td>
                <td className={`text-${changeColor(stock.data.d)}`}>
                  {stock.data.d}
                  {renderIcon(stock.data.d)}
                </td>
                <td className={`text-${changeColor(stock.data.dp)}`}>
                  {stock.data.dp} {renderIcon(stock.data.dp)}
                </td>
                <td className={`text-${changeColor(stock.data.h)}`}>
                  {stock.data.h} {renderIcon(stock.data.h)}
                </td>
                <td className={`text-${changeColor(stock.data.l)}`}>
                  {stock.data.l} {renderIcon(stock.data.l)}
                </td>
                <td className={`text-${changeColor(stock.data.o)}`}>
                  {stock.data.o} {renderIcon(stock.data.o)}
                </td>
                <td className={`text-${changeColor(stock.data.pc)}`}>
                  {stock.data.pc} {renderIcon(stock.data.pc)}
                  <button
                    className="btn btn-danger btn-sm ml-3 d-inline-block delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStock(stock.symbol);
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
