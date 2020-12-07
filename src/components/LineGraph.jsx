import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const LineGraph = (props) => {
  const [peakUse, setPeakUse] = useState();
  const [hourlyUses, setHourlyUses] = useState([]);

  useEffect(() => {
    // Create a 1000 random timestamps to simulate
    // our dataset.
    let timeStamps = [];
    for (let i = 0; i < 1000; i++) {
      let date = new Date(
        randInt(2019, 2020), // year
        randInt(1, 12), // month
        randInt(1, 28), // day
        randInt(0, 23), // hour
        randInt(0, 59), // minutes
        randInt(0, 59) // seconds
      );
      timeStamps.push(date);
    }
    // Initialize an empty array for our graph, prior to mapping
    // timestamps.
    let hoursArray = [];
    // Create 24 objects, one for each hour to contain the
    // number of uses, initialize each to zero.
    for (let i = 0; i < 24; i++) {
      hoursArray.push({ hour: i, uses: 0 });
    }

    let maxUses = 0;
    // Loop over all of the timestamps, extracting the hour
    // and incrementing the corresponding value.
    timeStamps.forEach((time) => {
      // Extract the hour.
      let hour = time.getHours();
      // Increment the uses for that hour.
      let newUses = hoursArray[hour].uses + 1;
      // Update maxUses to determine the hour with the most
      // usage.
      if (newUses >= maxUses) {
        maxUses = newUses;
        setPeakUse(hour);
      }
      // Update entry for the hour.
      hoursArray[hour].uses = newUses;
    });
    // This is hacky, but in the interest of time, slice off the pre-dawn hours
    // and tack them onto the end of the array for purposes of aligning the graph to a
    // 6:00AM start time.
    let preDawn = hoursArray.splice(0, 6);
    preDawn.forEach((ele) => hoursArray.push(ele));
    setHourlyUses(hoursArray);
  }, []);

  // Format the 24 hour time as 12 hour string.
  const formatTime = () => {
    if (peakUse == 12) return "12:00 AM";
    // Handle midnight seperately.
    else return peakUse <= 12 ? `${peakUse}:00 AM` : `${peakUse - 12}:00 PM`;
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-text">Most Popular Times</div>
      </div>
      <div>
        <div className="body-text">
          Gain insight on which time of the day your product is most popular.
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={hourlyUses}
            margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fontSize: 15 }} />
            <YAxis tick={{ fontSize: 15 }} />
            <Tooltip />
            <ReferenceLine x="12" stroke="red" label="Noon" />
            <ReferenceLine x="0" stroke="red" label="Midnight" />
            <Line type="linear" dataKey="uses" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="footer">
        <div className="body-text">
          <FiInfo style={{ marginRight: "10" }} />
          This product is used most often around {formatTime()}
        </div>
      </div>
    </div>
  );
};
export default LineGraph;

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
