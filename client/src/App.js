import { useEffect, useState } from "react";
import WeekHeader from "./components/weekHeader.js";
import Stock from "./components/stockComponent.js";
import "./styles.css";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DayStock from "./components/dayStocks.js";

function App() {
  // holds the index for the day we're on, initially 0
  const [currWeek, setCurrWeek] = useState(0);
  // holds the data gotten from database
  const [data, setData] = useState();
  const [changedData, setChangedDate] = useState();

  /* change week we're looking at */
  const changeWeekDown = (newWeek) => {
    setCurrWeek(currWeek - 1);
  };

  const changeWeekUp = (newWeek) => {
    setCurrWeek(currWeek + 1);
  };

  /* get initially data */
  useEffect(() => {
    async function fetchData() {
      // You can await here
      setData(await getData());
      setChangedDate(await getChangedData());
      // ...
    }
    fetchData();
  }, []);

  /* this is to format the dates */
  const dateoptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // US Eastern Time
  };

  const dateoptionsDay = {
    weekday: "long", // Display full weekday name
    month: "numeric", // Display numeric month
    day: "numeric", // Display numeric day of the month
    timeZone: "UTC", // US Eastern Time
  };

  if (data && changedData) {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="App">
                <WeekHeader
                  changeWeekDown={changeWeekDown}
                  changeWeekUp={changeWeekUp}
                  currWeekDate={new Date(
                    data[currWeek]["startingDay"]
                  ).toLocaleString("en-US", dateoptions)}
                  currWeekIndex={currWeek}
                ></WeekHeader>
                {data[currWeek]["days"].map((day) => {
                  return (
                    <div className="daySection">
                      <Link className="dayHeader" to={`/day/${day._id}`}>
                        <h1>
                          {new Date(day["date"]).toLocaleString(
                            "en-US",
                            dateoptionsDay
                          )}
                        </h1>
                      </Link>
                      <div className="beforeOpen">
                        <h3>Before Open</h3>
                        {day["stocks"]
                          .filter((obj) => obj.time === "time-pre-market")
                          .slice(0, 10)
                          .map((stock) => {
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
                      <div className="afterClose">
                        <h3>After Close</h3>
                        {day["stocks"]
                          .filter((obj) => obj.time === "time-after-hours")
                          .slice(0, 10)
                          .map((stock) => {
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
                })}
              </div>
            }
          />
          <Route path="/day/:id" element={<DayStock />} />
        </Routes>
      </Router>
    );
  }
}

async function getData() {
  const response = await fetch("http://localhost:4000/");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const weeks = await response.json();
  return weeks;
}

async function getChangedData() {
  const response = await fetch("http://localhost:4000/changed");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const changed = await response.json();
  return changed;
}
export default App;
