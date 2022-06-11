"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.recurGetTests = void 0;
var axios_1 = require("axios");
var index_1 = require("./index");
var token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjNlZDQ4MzlhYWY4ZjNjODM2YWI5NTEiLCJpYXQiOjE2NTI0MjY0MTUsImV4cCI6MTczODgyNjQxNX0.UVJgizRI79rm4LSOZnJ8FfmpiyALyfRIEOdY7SdCY68";
// ---------------------- DO NOT EDIT BELOW ----------------------
var authHeaders = {
    Authorization: token,
    "Content-Type": "application/json"
};
var getStatus;
var postStatus;
var searchCount = 0;
var attemptedBookings = 0;
var bookingIds = {};
var pastDates = [];
var dayInMs = 86400000;
var getAccount = function () { return __awaiter(void 0, void 0, void 0, function () {
    var startTime, response;
    return __generator(this, function (_a) {
        startTime = Date.now();
        response = axios_1["default"]
            .get("https://api.drivingtestnow.co.uk/account", {
            headers: authHeaders
        })
            .then(function (response) {
            var finTime = Date.now();
            getStatus = [
                "GET",
                "https://api.drivingtestnow.co.uk/account",
                response === null || response === void 0 ? void 0 : response.status,
                finTime - startTime,
            ];
            return response;
        })["catch"](function (err) {
            console.log(err);
            return { earlierTestSlots: new Array() };
        });
        return [2 /*return*/, response];
    });
}); };
var bookTest = function (slotId) { return __awaiter(void 0, void 0, void 0, function () {
    var data, startTime, response;
    return __generator(this, function (_a) {
        data = { testSlotId: slotId };
        startTime = Date.now();
        response = axios_1["default"]
            .post("https://api.drivingtestnow.co.uk/booktestslot", {
            body: JSON.stringify(data)
        }, {
            headers: authHeaders
        })
            .then(function (response) {
            var finTime = Date.now();
            postStatus = [
                "POST",
                "https://api.drivingtestnow.co.uk/booktestslot",
                response === null || response === void 0 ? void 0 : response.status,
                finTime - startTime,
            ];
            return response;
        })["catch"](function (err) {
            console.log(err);
            return {};
        });
        return [2 /*return*/, response];
    });
}); };
var sortTests = function (tests) { return __awaiter(void 0, void 0, void 0, function () {
    var acceptableTests;
    return __generator(this, function (_a) {
        acceptableTests = [];
        return [2 /*return*/, new Promise(function (res) {
                tests.forEach(function (entry) {
                    if ((entry === null || entry === void 0 ? void 0 : entry.available) === true) {
                        acceptableTests.push(entry);
                    }
                });
                res(acceptableTests);
            })];
    });
}); };
var parseDate = function (timestamp) {
    return new Date(parseInt(String(timestamp)));
};
var returnIsDay = function (timestamp, daySelection) { return __awaiter(void 0, void 0, void 0, function () {
    var day;
    return __generator(this, function (_a) {
        day = parseDate(timestamp).getDay();
        return [2 /*return*/, new Promise(function (res) {
                res(Object.values(daySelection)[day]);
            })];
    });
}); };
var returnDate = function (timestamp) { return __awaiter(void 0, void 0, void 0, function () {
    var date;
    return __generator(this, function (_a) {
        date = parseDate(timestamp).toString();
        return [2 /*return*/, new Promise(function (res) {
                res(date);
            })];
    });
}); };
var returnShortDate = function (timestamp) {
    var date = parseDate(timestamp);
    return "".concat(date.getDate(), "/").concat(date.getMonth() + 1, "/").concat(date.getFullYear());
};
var returnChosenDays = function (daySelection) {
    var chosenDays = [];
    for (var i = 0; i <= 6; i++) {
        if (Object.values(daySelection)[i]) {
            var str = Object.keys(daySelection)[i];
            str = str.slice(0, 1).toUpperCase() + str.slice(1);
            chosenDays.push(str);
        }
    }
    return chosenDays;
};
var recurGetTests = function (minDays, maxDays, daySelection) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!index_1.isRunning)
                    return [2 /*return*/];
                return [4 /*yield*/, (0, index_1.appendTiles)(pastDates)];
            case 1:
                _a.sent();
                return [4 /*yield*/, getAccount().then(function (account) {
                        console.clear();
                        console.log(getStatus);
                        searchCount++;
                        var testSlots = account === null || account === void 0 ? void 0 : account.earlierTestSlots;
                        var minBookingDate = Date.now() + dayInMs * minDays;
                        var maxBookingDate = Date.now() + dayInMs * maxDays;
                        sortTests(testSlots).then(function (tests) { return __awaiter(void 0, void 0, void 0, function () {
                            var message;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        message = [
                                            "\nBooking dates between: ".concat(returnShortDate(minBookingDate), " - ").concat(returnShortDate(maxBookingDate)),
                                            "Booking the following days: ".concat(returnChosenDays(daySelection).join(", ")),
                                            "\nChecked available driving tests ".concat(searchCount, " time(s)"),
                                            "Searching through ".concat(testSlots.length, " test(s)"),
                                            "There have been ".concat(pastDates.length, " available date(s)"),
                                            "Attempted to book ".concat(attemptedBookings, " test(s)"),
                                            "Booking IDs: ".concat(JSON.stringify(bookingIds), "\n"),
                                        ].join("\n");
                                        if (!(tests.length === 0)) return [3 /*break*/, 2];
                                        console.log(message);
                                        return [4 /*yield*/, (0, exports.recurGetTests)(minDays, maxDays, daySelection)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                    case 2:
                                        tests.forEach(function (test) { return __awaiter(void 0, void 0, void 0, function () {
                                            var bookingId, bookingDate;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        bookingId = test === null || test === void 0 ? void 0 : test._id;
                                                        bookingDate = test === null || test === void 0 ? void 0 : test.datetimeMilliSeconds;
                                                        // Log tests that are currently available
                                                        return [4 /*yield*/, returnDate(bookingDate).then(function (date) {
                                                                if (!pastDates.includes(date))
                                                                    pastDates.push(date);
                                                                console.log(date);
                                                            })];
                                                    case 1:
                                                        // Log tests that are currently available
                                                        _a.sent();
                                                        // Return what day the test is on
                                                        return [4 /*yield*/, returnIsDay(bookingDate, daySelection).then(function (isDay) { return __awaiter(void 0, void 0, void 0, function () {
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            if (!(isDay &&
                                                                                bookingDate > minBookingDate &&
                                                                                bookingDate < maxBookingDate &&
                                                                                (!bookingIds[bookingId] ||
                                                                                    bookingIds[bookingId] > Date.now() + 300000))) return [3 /*break*/, 2];
                                                                            // Book the test
                                                                            return [4 /*yield*/, bookTest(bookingId).then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                                                    return __generator(this, function (_a) {
                                                                                        switch (_a.label) {
                                                                                            case 0: return [4 /*yield*/, returnDate(bookingDate).then(function (date) {
                                                                                                    console.log("\nThe date of the booked test is ".concat(date, "\n").concat(postStatus));
                                                                                                })];
                                                                                            case 1:
                                                                                                _a.sent();
                                                                                                return [2 /*return*/];
                                                                                        }
                                                                                    });
                                                                                }); })];
                                                                        case 1:
                                                                            // Book the test
                                                                            _a.sent();
                                                                            bookingIds[bookingId] = Date.now();
                                                                            attemptedBookings++;
                                                                            _a.label = 2;
                                                                        case 2: return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); })];
                                                    case 2:
                                                        // Return what day the test is on
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        console.log(message);
                                        return [4 /*yield*/, (0, exports.recurGetTests)(minDays, maxDays, daySelection)];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.recurGetTests = recurGetTests;
await (0, exports.recurGetTests)(15, 60, {
    sunday: false,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true
});
