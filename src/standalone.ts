import axios, { AxiosResponse } from "axios";
import { appendTiles, isRunning } from "./index";

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjNlZDQ4MzlhYWY4ZjNjODM2YWI5NTEiLCJpYXQiOjE2NTI0MjY0MTUsImV4cCI6MTczODgyNjQxNX0.UVJgizRI79rm4LSOZnJ8FfmpiyALyfRIEOdY7SdCY68";

// ---------------------- DO NOT EDIT BELOW ----------------------

const authHeaders = {
  Authorization: token,
  "Content-Type": "application/json",
};
let getStatus: Array<any>;
let postStatus: Array<any>;
let searchCount: number = 0;
let attemptedBookings: number = 0;
const bookingIds: { [key: string]: any } = {};
const pastDates: Array<string> = [];
const dayInMs: number = 86_400_000;

interface AccountObject {
  earlierTestSlots: Array<TestObject>;
}

interface TestObject {
  _id: string;
  datetimeMilliSeconds: number;
  available: boolean;
}

const getAccount = async (): Promise<any> => {
  const startTime = Date.now();
  const response = axios
    .get<AccountObject>(`https://api.drivingtestnow.co.uk/account`, {
      headers: authHeaders,
    })
    .then((response) => {
      const finTime = Date.now();
      getStatus = [
        "GET",
        `https://api.drivingtestnow.co.uk/account`,
        response?.status,
        finTime - startTime,
      ];
      return response;
    })
    .catch((err) => {
      console.log(err);
      return { earlierTestSlots: new Array() };
    });

  return response;
};

const bookTest = async (
  slotId: string
): Promise<AxiosResponse<any, any> | {}> => {
  const data = { testSlotId: slotId };
  const startTime = Date.now();

  const response = axios
    .post(
      `https://api.drivingtestnow.co.uk/booktestslot`,
      {
        body: JSON.stringify(data),
      },
      {
        headers: authHeaders,
      }
    )
    .then((response) => {
      const finTime = Date.now();
      postStatus = [
        "POST",
        `https://api.drivingtestnow.co.uk/booktestslot`,
        response?.status,
        finTime - startTime,
      ];
      return response;
    })
    .catch((err) => {
      console.log(err);
      return {};
    });

  return response;
};

const sortTests = async (
  tests: Array<TestObject>
): Promise<Array<TestObject>> => {
  const acceptableTests: Array<TestObject> = [];
  return new Promise((res) => {
    tests.forEach((entry: TestObject) => {
      if (entry?.available === true) {
        acceptableTests.push(entry);
      }
    });
    res(acceptableTests);
  });
};

const parseDate = (timestamp: number): Date =>
  new Date(parseInt(String(timestamp)));

const returnIsDay = async (
  timestamp: number,
  daySelection: object
): Promise<boolean> => {
  const day = parseDate(timestamp).getDay();
  return new Promise((res) => {
    res(Object.values(daySelection)[day]);
  });
};

const returnDate = async (timestamp: number): Promise<string> => {
  const date = parseDate(timestamp).toString();
  return new Promise((res) => {
    res(date);
  });
};

const returnShortDate = (timestamp: number): string => {
  const date = parseDate(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const returnChosenDays = (daySelection: object): Array<string> => {
  const chosenDays = [];
  for (let i = 0; i <= 6; i++) {
    if (Object.values(daySelection)[i]) {
      let str = Object.keys(daySelection)[i];
      str = str.slice(0, 1).toUpperCase() + str.slice(1);
      chosenDays.push(str);
    }
  }
  return chosenDays;
};

export const recurGetTests = async (
  minDays: number,
  maxDays: number,
  daySelection: object
): Promise<any> => {
  if (!isRunning) return;

  await appendTiles(pastDates);

  await getAccount().then((account: AccountObject) => {
    console.clear();
    console.log(getStatus);
    searchCount++;

    const testSlots = account?.earlierTestSlots;
    const minBookingDate = Date.now() + dayInMs * minDays;
    const maxBookingDate = Date.now() + dayInMs * maxDays;

    sortTests(testSlots).then(async (tests: Array<TestObject>) => {
      const message = [
        `\nBooking dates between: ${returnShortDate(
          minBookingDate
        )} - ${returnShortDate(maxBookingDate)}`,
        `Booking the following days: ${returnChosenDays(daySelection).join(
          ", "
        )}`,
        `\nChecked available driving tests ${searchCount} time(s)`,
        `Searching through ${testSlots.length} test(s)`,
        `There have been ${pastDates.length} available date(s)`,
        `Attempted to book ${attemptedBookings} test(s)`,
        `Booking IDs: ${JSON.stringify(bookingIds)}\n`,
      ].join("\n");

      // If there are no tests, recur and return
      if (tests.length === 0) {
        console.log(message);
        await recurGetTests(minDays, maxDays, daySelection);
        return;
      }

      tests.forEach(async (test) => {
        const bookingId = test?._id;
        const bookingDate = test?.datetimeMilliSeconds;

        // Log tests that are currently available
        await returnDate(bookingDate).then((date) => {
          if (!pastDates.includes(date)) pastDates.push(date);
          console.log(date);
        });

        // Return what day the test is on
        await returnIsDay(bookingDate, daySelection).then(async (isDay) => {
          // Check that the day is acceptable and that
          // it's in some date range, also that it hasn't
          // already been booking by this runner
          if (
            isDay &&
            bookingDate > minBookingDate &&
            bookingDate < maxBookingDate &&
            (!bookingIds[bookingId] ||
              bookingIds[bookingId] > Date.now() + 300000)
          ) {
            // Book the test
            await bookTest(bookingId).then(async () => {
              await returnDate(bookingDate).then((date) => {
                console.log(
                  `\nThe date of the booked test is ${date}\n${postStatus}`
                );
              });
            });
            bookingIds[bookingId] = Date.now();
            attemptedBookings++;
          }
        });
      });

      console.log(message);
      await recurGetTests(minDays, maxDays, daySelection);
    });
  });
};

// await recurGetTests(15, 60, {
//   sunday: false,
//   monday: true,
//   tuesday: true,
//   wednesday: true,
//   thursday: true,
//   friday: true,
//   saturday: true,
// });
