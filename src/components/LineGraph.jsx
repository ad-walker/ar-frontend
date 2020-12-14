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

const LineGraph = () => {
  const [hourlyUses, setHourlyUses] = useState();
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    // Create a random timestamps to simulate
    // our dataset.
    let timeStamps = [];
    for (let i = 0; i < 500; i++) {
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
    // number of uses, key for the graph, and a string.
    for (let i = 0; i < 24; i++) {
      // Convert 24 hour array index to 12 hour.
      let twelveHour = i % 12;
      // Handle midnight and noon.
      if(twelveHour === 0)
        twelveHour = 12;
      // Assign postfix based on 24 hour value of i.
      const postfix = i >= 12 ? "PM" : "AM";
      const key = twelveHour + postfix;
      const fullString = twelveHour + ":00 " + postfix;
      hoursArray.push({ key, uses: 0, fullString });
    }

    // Loop over all of the timestamps, extracting the hour key
    // and incrementing the corresponding value.
    timeStamps.forEach((time) => {
      // Extract the hour.
      let hour = time.getHours();
      // Increment the uses for that hour.
      hoursArray[hour].uses++;
    });

    // Once all timestamps have been added to the array of hours, get the hour/index
    // with the most uses.
    let peakHour, maxUses = 0;
    for(let i = 0; i < hoursArray.length; i++) {
      if(hoursArray[i].uses > maxUses) {
        maxUses = hoursArray[i].uses;
        peakHour = i;
      }
    }

    const hoursLen = hoursArray.length;
    // JS modulo in case peak use is midnight (array index 0), prev hour will wrap
    // to last element of the array.
    const prevHour = ((peakHour - 1 % hoursLen) + hoursLen) % hoursLen;
    setTimeString(`${hoursArray[prevHour].fullString} and ${hoursArray[peakHour].fullString}`)
  
    // This is hacky, but in the interest of time, slice off the pre-dawn hours
    // and tack them onto the end of the array for purposes of aligning the graph to a
    // 6:00AM start time.
    let preDawn = hoursArray.splice(0, 6);
    preDawn.forEach((ele) => hoursArray.push(ele));
    // Finally, update state.
    setHourlyUses(hoursArray);
  }, []);


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
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="key" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 15 }} />
            <Tooltip />
            <ReferenceLine x="12PM" stroke="red" label="Noon" />
            <ReferenceLine x="12AM" stroke="red" label="Midnight" />
            <Line type="linear" dataKey="uses" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="footer">
        <div className="body-text">
          <FiInfo style={{ marginRight: "10" }} />
          This product is most often used between {timeString}
        </div>
      </div>
    </div>
  );
};
export default LineGraph;

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
