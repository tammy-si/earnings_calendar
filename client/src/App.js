import { useEffect, useState } from "react";
import WeekHeader from "./components/weekHeader.js";

function App() {
  // holds the index for the day we're on, initially 0
  const [currWeek, setCurrWeek] = useState(0);
  // holds the data gotten from database
  const [data, setData] = useState();

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
      // ...
    }
    fetchData();
  }, []);

  /* this is to format the dates */
  const dateoptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York", // US Eastern Time
  };

  if (data) {
    return (
      <div className="App">
        <WeekHeader
          changeWeekDown={changeWeekDown}
          changeWeekUp={changeWeekUp}
          currWeekDate={new Date(data[currWeek]["startingDay"]).toLocaleString(
            "en-US",
            dateoptions
          )}
          currWeekIndex={currWeek}
        ></WeekHeader>
      </div>
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

export default App;
