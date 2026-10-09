// The strategy illustrations to cycle through, with the name shown when paused
const strategies = [
  { file: "ema_4.png", name: "Moving average crossover" },
  { file: "rsi_4.png", name: "RSI overbought and oversold" },
  { file: "macd_4.png", name: "MACD signal cross" },
  { file: "bb_4.png", name: "Bollinger Band Re-entry" },
  { file: "dc_4.png", name: "Donchain breakout" }
];

const folder = "images/home/strategies/";
const intervalMs = 1000;

const box = document.getElementById("strategy-box");
const img = document.getElementById("strategy-img");
const nameEl = document.getElementById("strategy-name");
const hint = document.getElementById("strategy-hint");

let index = 0;
let timer = null;

// Load every image once up front so swapping never flickers
strategies.forEach(function (s) {
  const preload = new Image();
  preload.src = folder + s.file;
});

// Show the strategy at position i
function show(i) {
  index = i;
  img.src = folder + strategies[i].file;
  img.alt = "Illustration: " + strategies[i].name;
  nameEl.textContent = strategies[i].name;
}

// Start cycling to the next strategy every intervalMs
function start() {
  timer = setInterval(function () {
    show((index + 1) % strategies.length);
  }, intervalMs);
  box.classList.remove("paused");
  hint.textContent = "Tap to pause";
}

// Stop on the current strategy and reveal its name
function stop() {
  clearInterval(timer);
  timer = null;
  box.classList.add("paused");
  hint.textContent = "Tap to resume";
}

// Pause if running, resume if paused
function toggle() {
  if (timer) {
    stop();
  } else {
    start();
  }
}

box.addEventListener("click", toggle);

// Let keyboard users pause and resume with Enter or Space
box.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggle();
  }
});

show(0);

// Visitors who ask their device to reduce motion get it paused on the first chart
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  stop();
} else {
  start();
}

// The charts shown in the test card, in the order they rotate
const testCharts = [
  "trade3.png",
  "trade40.png",
  "trade120.png",
  "trade156.png",
  "trade1500.png"
];

const testFolder = "images/tests/first-4h-candle-reentry/";
const testIntervalMs = 5000;

const testImg = document.getElementById("test-img");
const testCard = testImg ? testImg.closest(".test") : null;

let testIndex = 0;
let testTimer = null;

// Load every chart once up front so swapping never flickers
testCharts.forEach(function (file) {
  const preload = new Image();
  preload.src = testFolder + file;
});

// Show the chart at position i
function showTestChart(i) {
  testIndex = i;
  testImg.src = testFolder + testCharts[i];
}

// Start moving to the next chart every testIntervalMs
function startTestRotation() {
  if (testTimer) return;
  testTimer = setInterval(function () {
    showTestChart((testIndex + 1) % testCharts.length);
  }, testIntervalMs);
}

// Stop on the current chart
function stopTestRotation() {
  clearInterval(testTimer);
  testTimer = null;
}

// Only run if the card exists, there is more than one chart,
// and the visitor hasn't asked their device to reduce motion
if (
  testImg &&
  testCharts.length > 1 &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  startTestRotation();

  // Pause while a mouse is over the card so people can study a chart.
  // Touch screens are left out so a tap doesn't freeze it.
  testCard.addEventListener("pointerenter", function (e) {
    if (e.pointerType === "mouse") stopTestRotation();
  });
  testCard.addEventListener("pointerleave", function (e) {
    if (e.pointerType === "mouse") startTestRotation();
  });
}