import fetch from "node-fetch";
import { json } from "stream/consumers";

const token =
  "";
const minDays = 15;
const maxDays = 60;
const daySelection = {
  sunday: false,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
};

// ---------------------- DO NOT EDIT BELOW ----------------------

let getStatus;
const getTests = async (token) => {
  let startTime = Date.now();
  const response = fetch(`https://api.drivingtestnow.co.uk/account`, {
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
      return response.json();
    })
    .then((data) => {
      return data;
    });

  return response;
};

let postStatus;
const bookTests = async (token, slotId) => {
  const data = { testSlotId: slotId };
  let startTime = Date.now();

  const response = fetch(`https://api.drivingtestnow.co.uk/booktestslot`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      let finTime = Date.now();
      postStatus = [
        "POST",
        `https://api.drivingtestnow.co.uk/booktestslot`,
        response?.status,
        finTime - startTime,
      ];
      return response.json();
    })
    .then((data) => {
      return data;
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

const returnDay = async (timestamp) => {
  let ts = new Date(timestamp);
  let day = ts.getDay();
  return new Promise((res) => {
    let bool = Object.values(daySelection)[day];
    res(bool);
  });
};

let count = 0;
const dayInMs = 86400000;
const recurGetTests = () => {
  getTests(token).then((res) => {
    console.clear();
    console.log(getStatus);

    const testSlots = res?.earlierTestSlots;
    let attemptedBooking = false;
    count++;

    countArray(testSlots).then((arr) => {
      if (arr.length === 0) {
        console.log(
          `Checked available driving tests ${count} time(s)\nChecked through ${testSlots.length} potential test(s)`
        );
        recurGetTests();
      } else {
        console.log(
          `Checked available driving tests ${count} time(s)\nChecked through ${testSlots.length} potential test(s)`
        );

        arr.forEach((entry) => {
          let bookingDate = entry?.datetimeMilliSeconds;
          let minBookingDate = Date.now() + dayInMs * minDays;
          let maxBookingDate = Date.now() + dayInMs * maxDays;

          returnDay(entry?.datetimeMilliSeconds).then((isDay) => {
            let ts = new Date(entry?.datetimeMilliSeconds);
            let day = ts.getDay();
            let dayStr = Object.keys(daySelection)[day];
            dayStr =
              dayStr.charAt(0).toUpperCase() + dayStr.slice(1).toLowerCase();
            console.log(`The day of the booked test is ${dayStr}`);

            if (
              isDay &&
              bookingDate > minBookingDate &&
              bookingDate < maxBookingDate
            ) {
              attemptedBooking
                ? null
                : bookTests(token, entry?._id).then((res) => {
                    console.log(res);
                    console.log(postStatus);
                  });

              attemptedBooking = true;
            }
          });
        });
        attemptedBooking ? null : recurGetTests();
      }
    });
  });
};

recurGetTests();
