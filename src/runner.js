import fetch from "node-fetch";

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
      if (response?.status < 400) return response.json();
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
      if (response?.status < 400) return response.json();
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
  let date = ts.toString();
  return new Promise((res) => {
    res(date);
  });
};

const delay = ms => new Promise(res => setTimeout(res, ms));

let count = 0;
let pastDates = [];
let attemptedBookings = 0;
const dayInMs = 86400000;
const recurGetTests = async () => {
  getTests(token).then((res) => {
    console.clear();
    console.log(getStatus);

    const testSlots = res?.earlierTestSlots;

    let minBookingDate = Date.now() + dayInMs * minDays;
    let maxBookingDate = Date.now() + dayInMs * maxDays;
    let attemptedBooking = false;

    count++;

    countArray(testSlots).then(async (arr) => {

      let message = [
        `\nChecked available driving tests ${count} time(s)`,
        `There have been ${pastDates.length} available test(s)`,
        `Attempted to book ${attemptedBookings} test(s)\n`
      ];
      message = message.join("\n");

      if (arr.length === 0) {
        console.log(message);
        recurGetTests();
      } else {
        console.log(message);

        arr.forEach(async (entry) => {
          let bookingDate = entry?.datetimeMilliSeconds;

          await returnDate(bookingDate).then((date) => {
            pastDates.includes(date) ? null : pastDates.push(date);
            console.log(date);
          });

          await returnDay(bookingDate).then(async (isDay) => {
            if (
              isDay &&
              bookingDate > minBookingDate &&
              bookingDate < maxBookingDate
            ) {
              attemptedBooking
                ? null
                : await bookTests(token, entry?._id).then(async (res) => {
                    await returnDate(bookingDate).then((date) => {
                      console.log(`\nThe date of the booked test is ${date}\n`);
                    });
                    console.log(postStatus);
                    attemptedBookings++;
                    await delay(120000);
                  });

              attemptedBooking = true;
            }
          });
        });
        await recurGetTests();
      }
    });
  });
};

await recurGetTests();
