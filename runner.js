import fetch from "node-fetch";

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjNlZDQ4MzlhYWY4ZjNjODM2YWI5NTEiLCJpYXQiOjE2NTI0MjY0MTUsImV4cCI6MTczODgyNjQxNX0.UVJgizRI79rm4LSOZnJ8FfmpiyALyfRIEOdY7SdCY68";
const minDays = 30;
const maxDays = 40;

// ---------------------- DO NOT EDIT BELOW ----------------------

const getTests = async (token) => {
  const response = fetch(`https://api.drivingtestnow.co.uk/account`, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  return response;
};

const bookTests = async (token, testSlotId) => {
  const response = fetch(`https://api.drivingtestnow.co.uk/booktestslot`, {
    method: "POST",
    body: {
      testSlotId: testSlotId,
    },
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
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

let count = 0;
const dayInMs = 86400000;
const recurGetTests = () => {
  getTests(token).then((res) => {
    console.clear();
    const testSlots = res?.earlierTestSlots;

    count++;
    countArray(testSlots).then((arr) => {
      if (arr.length === 0) {
        console.log(`Checked available driving tests ${count} time(s)\nChecked through ${testSlots.length} potential test(s)`);
        recurGetTests();
      } else {
        arr.forEach((entry) => {
          let bookingDate = entry?.datetimeMilliSeconds;
          let minBookingDate = bookingDate + dayInMs * minDays;
          let maxBookingDate = bookingDate + dayInMs * maxDays;

          if (bookingDate > minBookingDate && bookingDate < maxBookingDate) {
            console.log(entry);
            // bookTests(token, entry?._id).then((res) => console.log(res));
            return;
          } else {
            recurGetTests();
          }
        });
      }
    });
  });
};

recurGetTests();
