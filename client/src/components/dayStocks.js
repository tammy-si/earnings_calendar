//attribution <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Smashicons - Flaticon</a>
// another attribution <a href="https://www.flaticon.com/free-icons/back" title="back icons">Back icons created by Smashicons - Flaticon</a>
// <a target="_blank" href="https://icons8.com/icon/j1UxMbqzPi7n/no-image">No Image</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Stock from "./stockComponent";

function DayStock() {
  const location = useLocation();
  const { id } = useParams();

  const [dayData, setDayData] = useState();
  const [changedData, setChangedDate] = useState();

  const dateoptionsDay = {
    weekday: "long", // Display full weekday name
    month: "numeric", // Display numeric month
    day: "numeric", // Display numeric day of the month
    timeZone: "UTC", // US Eastern Time
  };

  // fetch the data about the day from mongoDB using the id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/day/" + id);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const day = await response.json();
        setDayData(day);
        setChangedDate(await getChangedData());
      } catch (error) {
        console.error("Error fetching day data:", error);
      }
    };
    fetchData();
  }, []);

  if (dayData && changedData) {
    const beforeOpenStocks = dayData["stocks"].filter(
      (obj) => obj.time === "time-pre-market"
    );
    const afterCloseStock = dayData["stocks"].filter(
      (obj) => obj.time === "time-after-hours"
    );
    const noTimeStock = dayData["stocks"].filter(
      (obj) => obj.time === "time-not-supplied"
    );

    return (
      <div class="dayStockDiv">
        <h1>
          {new Date(dayData.date).toLocaleString("en-US", dateoptionsDay)}{" "}
        </h1>
        <div className="before">
          <h2>Before Open</h2>
          {beforeOpenStocks.map((stock) => {
            return (
              <Stock
                img_url={stock.img_url}
                stockSymbol={stock.symbol}
                companyName={stock.companyName}
                yahooLink={stock.yahooLink}
                changed={changedData}
              ></Stock>
            );
          })}
        </div>
        <div className="after">
          <h2>After Close</h2>
          {afterCloseStock.map((stock) => {
            return (
              <Stock
                img_url={stock.img_url}
                stockSymbol={stock.symbol}
                companyName={stock.companyName}
                yahooLink={stock.yahooLink}
                changed={changedData}
              ></Stock>
            );
          })}
        </div>
        <div className="none">
          <h2>Unknow Time</h2>
          {noTimeStock.map((stock) => {
            return (
              <Stock
                img_url={stock.img_url}
                stockSymbol={stock.symbol}
                companyName={stock.companyName}
                yahooLink={stock.yahooLink}
                changed={changedData}
              ></Stock>
            );
          })}
        </div>
      </div>
    );
  }
}

async function getChangedData() {
  const response = await fetch("http://localhost:4000/changed");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const changed = await response.json();
  return changed;
}

export default DayStock;
