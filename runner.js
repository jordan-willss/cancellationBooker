import fetch from "node-fetch";

const token =
  "";
const minDays = 30;
const maxDays = 40;
const daySelection = {
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: true,
    friday: true,
    saturday: true
}

// ---------------------- DO NOT EDIT BELOW ----------------------

let getStatus;
const getTests = async (token) => {
  const response = fetch(`https://api.drivingtestnow.co.uk/account`, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      getStatus = [
        "GET",
        `https://api.drivingtestnow.co.uk/account`,
        response?.status,
      ];
      return response.json();
    })
    .then((data) => {
      return data;
    });

  return response;
};

let postStatus;
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
  postStatus = [
    "POST",
    `https://api.drivingtestnow.co.uk/booktestslot`,
    response?.status,
  ];
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

const returnDate = (timestamp) => {
    let ts = new Date(timestamp);
    let day = ts.getDay();

    return Object.values(daySelection)[day]
};

let count = 0;
const dayInMs = 86400000;
const recurGetTests = () => {
  getTests(token).then((res) => {
    console.clear();
    console.log(getStatus);

    returnDate(Date.now());

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
          
          let ts = new Date(bookingDate);
          if(returnDate(bookingDate)) {
            if (bookingDate > minBookingDate && bookingDate < maxBookingDate) {
                console.log(entry);
                // bookTests(token, entry?._id).then((res) => console.log(res));
                attemptedBooking = true;
            }
          }
        });
        attemptedBooking ? null : recurGetTests();
      }
    });
  });
};

recurGetTests();
