import { recurGetTests } from "./runner";

let tileContainer;
let searchButton;

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
  tileContainer = document.getElementById("tile-container");
  searchButton = document.getElementById("search_button");

  searchButton.onclick = () => {
    isRunning = !isRunning;

    if (isRunning) {
			tileContainer.innerHTML = '';
      recurGetTests({ minDays, maxDays, daySelection });
    } else {
			tileContainer.innerHTML = notRunning;
		}
  };
}

let formattedArray = [];
export async function appendTiles(array = [], options = {}) {
  return new Promise((res) => {
    if (array.length === 0 && tileContainer.innerHTML !== noSlots) {
      tileContainer.innerHTML = noSlots;
      res("There are currently no available slots");
    } else if (tileContainer.childElementCount !== array.length && array.length > 0) {
      formattedArray = [];
      if (tileContainer.innerHTML === noSlots) {
        tileContainer.innerHTML = "";
      }
      for (let i = 0; i < array.length; i++) {
        formattedArray[
          i
        ] = `<div class="bc_tile"><span>${array[i]}</span></div>`;
      }

      if (formattedArray.length === array.length) {
        tileContainer.insertAdjacentHTML(
          "beforeend",
          formattedArray.join("\n")
        );
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
