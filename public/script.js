// Initialize Flickity objects
let flktyTop = new Flickity(".top-carousel", {
  // Initial index
  initialIndex: 29,
  // Wrap around settings
  freeScroll: true,
  wrapAround: true,
  // Disable page dots
  pageDots: false,
  // Higher friction
  selectedAttraction: 0.2,
  friction: 0.8,
});
let flktyBottom = new Flickity(".bottom-carousel", {
  // Wrap around settings
  freeScroll: true,
  wrapAround: true,
  // Disable page dots
  pageDots: false,
  // Higher friction
  selectedAttraction: 0.2,
  friction: 0.8,
});

// DOM Elements and variables
const changeBtn = document.getElementById("change-btn"),
  topInput = document.getElementById("top-value"),
  bottomInput = document.getElementById("bottom-value"),
  topLabel = document.getElementById("top-label"),
  bottomLabel = document.getElementById("bottom-label"),
  worldCurrencies = [
    "$",
    "лв",
    "R$",
    "$",
    "CHF",
    "¥",
    "Kč",
    "kr",
    "£",
    "$",
    "Ft",
    "Rp",
    "₪",
    "₹",
    "kr",
    "¥",
    "₩",
    "$",
    "RM",
    "kr",
    "$",
    "₱",
    "zł",
    "lei",
    "₽",
    "kr",
    "$",
    "฿",
    "₺",
    "$",
    "R",
  ];

// Functions
// Fetch function
async function calculateRates(currency) {
  const rates = await fetch(
    `https://api.exchangeratesapi.io/latest?base=${currency}`
  );
  const response = await rates.json();
  return response;
}
// Change the labels
function changeLabels() {
  topLabel.innerText = worldCurrencies[flktyTop.selectedIndex] + ":";
  bottomLabel.innerText = worldCurrencies[flktyBottom.selectedIndex] + ":";
}

// Initiate at startup
(() => {
  calculateRates(flktyTop.selectedElement.innerText).then((data) => {
    bottomInput.value = (
      topInput.value * data.rates[flktyBottom.selectedElement.innerText]
    ).toFixed(2);
  });

  changeLabels();
})();

// Event Listeners
// Top input conversion
topInput.addEventListener("input", () => {
  calculateRates(flktyTop.selectedElement.innerText).then((data) => {
    bottomInput.value = (
      topInput.value * data.rates[flktyBottom.selectedElement.innerText]
    ).toFixed(2);
  });
});

// Bottom input conversion
bottomInput.addEventListener("input", () => {
  calculateRates(flktyBottom.selectedElement.innerText).then((data) => {
    topInput.value = (
      bottomInput.value * data.rates[flktyTop.selectedElement.innerText]
    ).toFixed(2);
  });
});

// Change top carousel unit
flktyTop.on("settle", () => {
  calculateRates(flktyTop.selectedElement.innerText).then((data) => {
    bottomInput.value = (
      topInput.value * data.rates[flktyBottom.selectedElement.innerText]
    ).toFixed(2);
  });
  changeLabels();
});

// Change bottom carousel unit
flktyBottom.on("settle", () => {
  calculateRates(flktyBottom.selectedElement.innerText).then((data) => {
    topInput.value = (
      bottomInput.value * data.rates[flktyTop.selectedElement.innerText]
    ).toFixed(2);
  });
  changeLabels();
});

changeBtn.addEventListener("click", () => {
  // Flip button animation
  changeBtn.classList.add("swap-btn-flip");
  setTimeout(() => changeBtn.classList.remove("swap-btn-flip"), 200);

  let temp = flktyBottom.selectedIndex;
  // Flip the carousels
  flktyBottom.select(flktyTop.selectedIndex);
  flktyTop.select(temp);

  temp = topInput.value;
  topInput.value = bottomInput.value;
  bottomInput.value = temp;
});

// Static click on top carousel to select other cells
flktyTop.on("staticClick", (event, pointer, cellElement, cellIndex) =>
  flktyTop.select(cellIndex)
);

// Static click on bottom carousel to select other cells
flktyBottom.on("staticClick", (event, pointer, cellElement, cellIndex) =>
  flktyBottom.select(cellIndex)
);
