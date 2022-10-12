"use strict";
//-------------------- variables --------------------
const dogeGif = document.querySelector(".dogecoin-info__gif");
const message = document.querySelector(".dogecoin-info__message");
const arrowContainer = document.querySelector(".arrow-container");
const settingsDrawer = document.querySelector(".settings-drawer");
const settingsDrawerToggle = document.querySelector(".settings-drawer__toggle");
const timeIntervalRadioInputs = document.querySelectorAll(
  'input[name="timeInterval"]'
);

const happyGif = "https://c.tenor.com/XUX6DFHZ-l0AAAAi/cool-doge-cool-dog.gif";
const sadGif = "https://c.tenor.com/5YrUft9OXfUAAAAC/bonk-doge.gif";

let dogeData = 0;
let timeInterval = "24hour";
//------------------ end variables ------------------

//-------------------- functions --------------------
const getDogeData = async function () {
  try {
    const myRequest = new Request(
      "https://api.coingecko.com/api/v3/coins/dogecoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=fals"
    );
    const response = await fetch(myRequest);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

const handleDogeData = function (data = 0, timeInterval = "24hour") {
  if (data == 0) {
    return;
  }

  console.log(data);

  let percentChangeOverTimeInterval;
  let timeIntervalMessage;

  if (timeInterval == "24hour") {
    console.log(data.market_data.price_change_percentage_24h);
    percentChangeOverTimeInterval = roundAccurately(
      data.market_data.price_change_percentage_24h,
      2
    );
    timeIntervalMessage = "24 hours";
  } else if (timeInterval == "1hour") {
    console.log(data.market_data.price_change_percentage_1h_in_currency.usd);
    percentChangeOverTimeInterval = roundAccurately(
      data.market_data.price_change_percentage_1h_in_currency.usd,
      2
    );
    timeIntervalMessage = "1 hour";
  }

  if (percentChangeOverTimeInterval < 0) {
    setMessage(
      `Dogecoin is down ${Math.abs(
        percentChangeOverTimeInterval
      )}% over the past ${timeIntervalMessage} :(`
    );
    setGif(sadGif);
    setArrows("bearish");
    arrowContainer.classList.remove("arrow-container--bg-bullish");
    arrowContainer.classList.add("arrow-container--bg-bearish");
  } else {
    setMessage(
      `Dogecoin is up ${percentChangeOverTimeInterval}% over the past ${timeIntervalMessage} :D`
    );
    setGif(happyGif);
    setArrows("bullish");
    arrowContainer.classList.remove("arrow-container--bg-bearish");
    arrowContainer.classList.add("arrow-container--bg-bullish");
  }
};

const setGif = function (url) {
  dogeGif.setAttribute("src", url);
};

const setMessage = function (text) {
  message.innerHTML = text;
};

const setArrows = function (state) {
  removeExistingArrows();

  for (let i = 0; i < 10; i++) {
    const arrowSpan = document.createElement("span");
    arrowSpan.classList.add(
      "material-icons",
      "md-96",
      "arrow",
      `a${i}`,
      state,
      `animation-${state}`
    );

    if (state == "bearish") {
      arrowSpan.innerHTML = "arrow_downward";
    } else {
      arrowSpan.innerHTML = "arrow_upward";
    }

    setRandomAnimationDelay(arrowSpan, 7000);
    arrowSpan.addEventListener("animationend", (e) => {
      resetAnimation(e);
    });
    arrowContainer.appendChild(arrowSpan);
  }
};

const removeExistingArrows = function () {
  const existingArrows = document.querySelectorAll(".arrow");
  if (existingArrows.length != 0) {
    console.log("existingArrows is not empty: ", existingArrows);
    existingArrows.forEach((e) => e.remove());
  }
};

const setRandomAnimationDelay = function (element, maxDelayMS = 5000) {
  element.style.animationDelay = `${getRandomInt(maxDelayMS)}ms`;
};

const resetAnimation = function (e) {
  const el = e.srcElement;

  setRandomAnimationDelay(el, 7000);

  if (el.classList.contains("animation-bearish")) {
    // reset bearish arrow aninmation
    el.classList.remove("animation-bearish");
    void el.offsetWidth;
    el.classList.add("animation-bearish");
  } else if (el.classList.contains("animation-bullish")) {
    // reset bullish arrow animation
    el.classList.remove("animation-bullish");
    void el.offsetWidth;
    el.classList.add("animation-bullish");
  }
};

const getRandomInt = function (max) {
  return Math.floor(Math.random() * max);
};

const roundAccurately = function (number, decimalPlaces) {
  return Number(
    Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces
  );
};

const toggleSettingsDrawer = function () {
  if (settingsDrawer.classList.contains("settings-drawer--closed")) {
    settingsDrawer.classList.remove("settings-drawer--closed");
    settingsDrawer.classList.add("settings-drawer--open");
  } else if (settingsDrawer.classList.contains("settings-drawer--open")) {
    settingsDrawer.classList.remove("settings-drawer--open");
    settingsDrawer.classList.add("settings-drawer--closed");
  }
};

const setTimeInterval = function () {
  for (const i of timeIntervalRadioInputs) {
    if (i.checked) {
      timeInterval = i.value;
    }
  }

  console.log(timeInterval);
};
//------------------ end functions ------------------

//---------------------- main -----------------------
const main = async function () {
  // get the initial dogeData and initalize the Doge + arrows
  dogeData = await getDogeData();
  handleDogeData(dogeData, timeInterval);

  // event listener to toggle the settings drawer
  settingsDrawerToggle.addEventListener("click", toggleSettingsDrawer);

  // listen for chagnes to the time interval options
  timeIntervalRadioInputs.forEach((element) => {
    element.addEventListener("input", () => {
      setTimeInterval();
      handleDogeData(dogeData, timeInterval);
    });
  });
};

main();
