const dogeGif = document.querySelector(".doge-gif");

const happyGif = "https://c.tenor.com/XUX6DFHZ-l0AAAAi/cool-doge-cool-dog.gif";
const sadGif = "https://c.tenor.com/5YrUft9OXfUAAAAC/bonk-doge.gif";

dogeGif.setAttribute("src", happyGif);

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
    // console.log(response);

    const percentChange24Hr = response.market_data.price_change_percentage_24h;
    console.log(percentChange24Hr);

    if (percentChange24Hr < 0) {
      console.log(
        `Dogecoin is down over the past 24 hours.. This makes the Doge sad :(`
      );
    } else if (percentChange24Hr > 0) {
      console.log(
        `Dogecoin is up over the past 24 hours.. This makes the Doge happy! :D`
      );
    } else {
      `Dogecoin price has not changed in the past 24 hours :/`;
    }
  });
