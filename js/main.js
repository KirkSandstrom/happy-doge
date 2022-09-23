"use strict";
const dogeGif = document.querySelector(".doge-gif");
const message = document.querySelector(".message");
const arrowContainer = document.querySelector(".arrow-container");
const arrows = document.querySelectorAll(".arrow");

const happyGif = "https://c.tenor.com/XUX6DFHZ-l0AAAAi/cool-doge-cool-dog.gif";
const sadGif = "https://c.tenor.com/5YrUft9OXfUAAAAC/bonk-doge.gif";

const getDogeData = function () {
  const myRequest = new Request(
    "https://api.coingecko.com/api/v3/coins/dogecoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=fals"
  );

  fetch(myRequest)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((response) => {
      handleDogeData(response);
    });
};

const handleDogeData = function (data = 0) {
  if (data == 0) {
    return;
  }

  const percentChange24Hr = data.market_data.price_change_percentage_24h;
  const roundedPercentChanger24Hr = roundAccurately(percentChange24Hr, 2);

  if (roundedPercentChanger24Hr < 0) {
    const roundedPercentChanger24Hr = roundAccurately(percentChange24Hr, 2);
    setMessage(
      `Dogecoin is down ${Math.abs(
        roundedPercentChanger24Hr
      )}% over the past 24 hours :(`
    );
    setGif(sadGif);
    setArrows("bearish");
    arrowContainer.classList.add("bg-bearish");
  } else {
    setMessage(
      `Dogecoin is up ${Math.abs(
        roundedPercentChanger24Hr
      )}% over the past 24 hours :D`
    );
    setGif(happyGif);
    setArrows("bullish");
    arrowContainer.classList.add("bg-bullish");
  }
};

const setGif = function (url) {
  dogeGif.setAttribute("src", url);
};

const setMessage = function (text) {
  message.innerHTML = text;
};

const setArrows = function (state) {
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

// main
getDogeData();
