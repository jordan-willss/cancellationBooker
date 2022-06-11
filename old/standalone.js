import fetch from 'node-fetch';

const token =
	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjNlZDQ4MzlhYWY4ZjNjODM2YWI5NTEiLCJpYXQiOjE2NTI0MjY0MTUsImV4cCI6MTczODgyNjQxNX0.UVJgizRI79rm4LSOZnJ8FfmpiyALyfRIEOdY7SdCY68';
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
let postStatus;
let searchCount = 0;
let attemptedBookings = 0;
const bookingIds = {};
const pastDates = [];
const dayInMs = 86_400_000;

const getTests = async token => {
	const startTime = Date.now();
	const response = fetch(`https://api.drivingtestnow.co.uk/account`, {
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
	})
		.then(response => {
			const finTime = Date.now();
			getStatus = [
				'GET',
				`https://api.drivingtestnow.co.uk/account`,
				response?.status,
				finTime - startTime,
			];
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch(err => {
			return { error: String(err), earlierTestSlots: [] };
		});

	return response;
};

const bookTests = async (token, slotId) => {
	const data = { testSlotId: slotId };
	const startTime = Date.now();

	const response = fetch(`https://api.drivingtestnow.co.uk/booktestslot`, {
		method: 'POST',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(response => {
			const finTime = Date.now();
			postStatus = [
				'POST',
				`https://api.drivingtestnow.co.uk/booktestslot`,
				response?.status,
				finTime - startTime,
			];
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch(err => {
			return { error: String(err) };
		});

	return response;
};

const sortTests = async (arr = []) => {
	const newArr = [];
	return new Promise(res => {
		arr.forEach(entry => {
			if (entry?.available === true) {
				newArr.push(entry);
			}
		});
		res(newArr);
	});
};

const parseDate = (timestamp = '') => new Date(parseInt(timestamp));

const returnDay = async (timestamp = '') =>  {
	const day = parseDate(timestamp).getDay();
	return new Promise(res => {
		res(Object.values(daySelection)[day]);
	});
};

const returnDate = async timestamp => {
	const date = parseDate(timestamp).toString();
	return new Promise(res => {
		res(date);
	});
};

const returnShortDate = (timestamp) => {
	const date = parseDate(timestamp);
	return(`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`);
};

const returnChosenDays = () => {
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

const recurGetTests = async () => {
	await getTests(token).then(res => {
		console.clear();
		console.log(getStatus);
		searchCount++;

		const testSlots = res?.earlierTestSlots;
		const minBookingDate = Date.now() + dayInMs * minDays;
		const maxBookingDate = Date.now() + dayInMs * maxDays;

		sortTests(testSlots).then(async tests => {
			const message = [
				`\nBooking dates between: ${returnShortDate(minBookingDate)} - ${returnShortDate(maxBookingDate)}`,
				`Booking the following days: ${returnChosenDays().join(', ')}`,
				`\nChecked available driving tests ${searchCount} time(s)`,
				`Searching through ${testSlots.length} test(s)`,
				`There have been ${pastDates.length} available date(s)`,
				`Attempted to book ${attemptedBookings} test(s)`,
				`Booking IDs: ${JSON.stringify(bookingIds)}\n`,
			].join('\n');

			// If there are no tests, recur and return
			if (tests.length === 0) {
				console.log(message);
				await recurGetTests();
				return;
			}

			tests.forEach(async test => {
				const bookingId = test?._id;
				const bookingDate = test?.datetimeMilliSeconds;

				// Log tests that are currently available
				await returnDate(bookingDate).then(date => {
					if (!pastDates.includes(date)) pastDates.push(date);
					console.log(date);
				});

				// Return what day the test is on
				await returnDay(bookingDate).then(async isDay => {
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
						await bookTests(token, bookingId).then(async res => {
							await returnDate(bookingDate).then(date => {
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
			await recurGetTests();
		});
	});
};

await recurGetTests();
