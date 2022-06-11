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
exports.appendTiles = exports.isRunning = void 0;
var standalone_1 = require("./standalone");
var tileContainer;
var searchButton;
var searchCounter;
var noSlots = "<h3 class=\"null_slots_warning\">There are currently no available slots</h3>";
var notRunning = "<h3 class=\"no_slots_warning\">Search is disabled</h3>";
exports.isRunning = false;
var minDays = 15;
var maxDays = 60;
var daySelection = {
    sunday: false,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true
};
function init() {
    tileContainer = document.getElementById("tile-container");
    searchButton = document.getElementById("search-button");
    searchCounter = document.getElementById("search-counter");
    tileContainer.innerHTML = notRunning;
    searchButton.onclick = function () {
        exports.isRunning = !exports.isRunning;
        if (exports.isRunning) {
            tileContainer.innerHTML = '';
            (0, standalone_1.recurGetTests)(minDays, maxDays, daySelection);
        }
        else {
            tileContainer.innerHTML = notRunning;
        }
    };
}
var count = 0;
var testDates = [];
function appendTiles(array, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (res) {
                    // Purely deals with counting
                    count++;
                    count === 1 ?
                        searchCounter.innerText = "There has been ".concat(count, " search") :
                        searchCounter.innerText = "There have been ".concat(count, " searches");
                    if (array.length < tileContainer.childElementCount) {
                        testDates = [];
                    }
                    if (array.length === 0 && tileContainer.innerHTML !== noSlots) {
                        tileContainer.innerHTML = noSlots;
                        res("There are currently no available slots");
                    }
                    else if (tileContainer.childElementCount !== array.length && array.length > 0) {
                        if (tileContainer.innerHTML === noSlots) {
                            tileContainer.innerHTML = "";
                        }
                        for (var i = 0; i < array.length; i++) {
                            testDates[i] = "<div class=\"bc_tile\"><span>".concat(array[i], "</span></div>");
                        }
                        if (testDates.length === array.length) {
                            tileContainer.insertAdjacentHTML("beforeend", testDates.join("\n"));
                        }
                        else {
                            tileContainer.innerHTML = "";
                        }
                        res("Tiles appended");
                    }
                    else {
                        res("Tiles do not need appending");
                    }
                })];
        });
    });
}
exports.appendTiles = appendTiles;
window.addEventListener("load", function () {
    init();
});
