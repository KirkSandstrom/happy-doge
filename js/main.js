const dogeGif = document.querySelector(".doge-gif");

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
  console.log(percentChange24Hr);

  if (percentChange24Hr < 0) {
    console.log(
      `Dogecoin is down over the past 24 hours.. This makes the Doge sad :(`
    );
    setGif(sadGif);
  } else {
    console.log(
      `Dogecoin is up over the past 24 hours.. This makes the Doge happy! :D`
    );
    setGif(happyGif);
  }
};

const setGif = function (url) {
  dogeGif.setAttribute("src", url);
};

getDogeData();
