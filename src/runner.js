import axios from "axios";
import { appendTiles, isRunning } from "./interface";
import * as auth from '../token.json';

const token = auth.token;

// ---------------------- DO NOT EDIT BELOW ----------------------

let getStatus;
const getTests = async (token) => {
  let startTime = Date.now();
  const response = axios
    .get(`https://api.drivingtestnow.co.uk/account`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      let finTime = Date.now();
      getStatus = [
        "GET",
        `https://api.drivingtestnow.co.uk/account`,
        response?.status,
        finTime - startTime,
      ];
      console.log(response)
      if (response?.status < 400) return response;
    });

  return response;
};

let postStatus;
const bookTests = async (token, slotId) => {
  if (attemptedBooking) return;

  const data = { testSlotId: slotId };
  let startTime = Date.now();

  const response = axios
    .post(
      `https://api.drivingtestnow.co.uk/booktestslot`,
      { testSlotId: slotId },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      let finTime = Date.now();
      postStatus = [
        "POST",
        `https://api.drivingtestnow.co.uk/booktestslot`,
        response?.status,
        finTime - startTime,
      ];
      attemptedBooking = true;
      if (response?.status < 400) return response;
    });

  return response;
};

const countArray = async (arr) => {
  let newArr = [];
  return new Promise((res) => {
    arr.forEach((entry) => {
      if (entry?.available === true) {
        newArr.push(entry);
      }
    });
    res(newArr);
  });
};

const returnDay = async (timestamp, daySelection) => {
  timestamp = parseInt(timestamp);
  let ts = new Date(timestamp);
  let day = ts.getDay();
  return new Promise((res) => {
    let bool = Object.values(daySelection)[day];
    res(bool);
  });
};

const returnDate = async (timestamp) => {
  timestamp = parseInt(timestamp);
  let ts = new Date(timestamp);
  let date = ts.toUTCString();
  return new Promise((res) => {
    res(date);
  });
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let attemptedBooking = false;
let count = 0;
let pastDates = [];
let attemptedBookings = 0;
const dayInMs = 86400000;
export const recurGetTests = async ({
  minDays,
  maxDays,
  daySelection
}) => {
  if(!isRunning) return;

  await appendTiles(pastDates);
  if (isRunning) {
    getTests(token).then((res) => {
      const testSlots = res?.data?.earlierTestSlots;

      let minBookingDate = Date.now() + dayInMs * minDays;
      let maxBookingDate = Date.now() + dayInMs * maxDays;
      attemptedBooking = false;

      count++;

      countArray(testSlots).then(async (arr) => {
        let message = [
          `\nChecked available driving tests ${count} time(s)`,
          `There have been ${pastDates.length} available date(s)`,
          `Attempted to book ${attemptedBookings} test(s)\n`,
        ];
        message = message.join("\n");

        if (arr.length === 0) {
          recurGetTests({ minDays, maxDays, daySelection });
        } else {
          arr.forEach(async (entry) => {
            let bookingDate = entry?.datetimeMilliSeconds;

            await returnDate(bookingDate).then((date) => {
              pastDates.includes(date) ? null : pastDates.push(date);
            });

            await returnDay(bookingDate, daySelection).then(async (isDay) => {
              if (
                isDay &&
                bookingDate > minBookingDate &&
                bookingDate < maxBookingDate
              ) {
                await bookTests(token, entry?._id).then(async (res) => {
                  console.log(res);
                });
                attemptedBookings++;
                await delay(300000);
              }
            });
          });
          await recurGetTests({ minDays, maxDays, daySelection });
        }
      });
    });
  }
};
