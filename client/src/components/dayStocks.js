//attribution <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Smashicons - Flaticon</a>
// another attribution <a href="https://www.flaticon.com/free-icons/back" title="back icons">Back icons created by Smashicons - Flaticon</a>
// <a target="_blank" href="https://icons8.com/icon/j1UxMbqzPi7n/no-image">No Image</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function DayStock() {
  const location = useLocation();
  const { id } = useParams();

  const [dayData, setDayData] = useState();

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
      } catch (error) {
        console.error("Error fetching day data:", error);
      }
    };
    fetchData();
  }, []);

  if (dayData) {
    console.log(dayData);
    return <h1>Hi</h1>;
  } else {
    return <h1>Error</h1>;
  }
}

export default DayStock;
