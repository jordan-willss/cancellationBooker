import { recurGetTests } from "./standalone";

let tileContainer: HTMLElement;
let searchButton: HTMLElement;
let searchCounter: HTMLElement;

const noSlots = `<h3 class="null_slots_warning">There are currently no available slots</h3>`;
const notRunning = `<h3 class="no_slots_warning">Search is disabled</h3>`;

export let isRunning = false;
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

function init() {
  tileContainer = document.getElementById("tile-container")!;
  searchButton = document.getElementById("search-button")!;
	searchCounter = document.getElementById("search-counter")!;

	tileContainer.innerHTML = notRunning;

  searchButton.onclick = () => {
    isRunning = !isRunning;

    if (isRunning) {
			tileContainer.innerHTML = '';
      recurGetTests(minDays, maxDays, daySelection);
    } else {
			tileContainer.innerHTML = notRunning;
		}
  };
}

let count = 0;
let testDates: Array<string> = [];
export async function appendTiles(array: Array<string>, options = {}) {
  return new Promise((res) => {
		// Purely deals with counting
    count++;
		count === 1 ?
			searchCounter.innerText = `There has been ${count} search` :
			searchCounter.innerText = `There have been ${count} searches`;
    
		if (array.length < tileContainer.childElementCount) {
			testDates = [];
		}

    if (array.length === 0 && tileContainer.innerHTML !== noSlots) {
      tileContainer.innerHTML = noSlots;
      res("There are currently no available slots");
    } else if (tileContainer.childElementCount !== array.length && array.length > 0) {
      if (tileContainer.innerHTML === noSlots) {
        tileContainer.innerHTML = "";
      }
      for (let i = 0; i < array.length; i++) {
        testDates[
          i
        ] = `<div class="bc_tile"><span>${array[i]}</span></div>`;
      }

      if (testDates.length === array.length) {
        tileContainer.insertAdjacentHTML(
          "beforeend",
          testDates.join("\n")
        );
      } else {
				tileContainer.innerHTML = "";
			}
      res("Tiles appended");
    } else {
      res("Tiles do not need appending");
    }
  });
}

window.addEventListener("load", () => {
  init();
});
