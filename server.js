const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const axios = require("axios").default;

// MIDDLEWARE
app.use(
  cors({
    origin: "*",
  })
);

// Build in middle ware to serve static content such as HTML, CSS, JS and Images
app.use(express.static(path.join(__dirname, "dist", "hw8")));

// Global variable declaration space
const FINNHUB_API_KEY = "c7tk99aad3i8dq4u55d0";

// ROUTES - To call Finnhub API for fetching stock details
app.get("/", async (req, res) => {
  console.log(
    "Path from where static index.html file is resolved",
    path.resolve(__dirname, "dist", "hw8", "index.html")
  );
  res.sendFile(path.resolve(__dirname, "dist", "hw8", "index.html"));
});

function performValidations(response) {
  if (response.status !== 200) {
    console.log("Validation IF");
    errorObject = {
      status: response.status,
      statusText: response.statusText,
      errorMessage: response.data.error,
    };
    throw new Error(JSON.stringify(errorObject));
  } else if (response.data === undefined) {
    console.log(response.data);
    if (response.data.s !== "ok") {
      console.log("Validation ELSE");
      errorObject = {
        statusText: response.data.s,
      };
      throw new Error(JSON.stringify(errorObject));
    }
  }
}

function performErrorHandling(res, err) {
  if (err.response !== undefined) {
    errorObject = {
      status: err.response.status,
      statusText: err.response.statusText,
      errorMessage: err.response.data.error,
    };
    res.status(err.response.status).json(errorObject);
  } else {
    errorObject = {
      status: 422,
      statusText: "No such ticker present",
      errorMessage: err.statusText,
    };
    res.status(errorObject.status).json(errorObject);
  }
}

// Test API = http://localhost:3000/company/description?symbol=AAPL
app.get("/company/description", async (req, res) => {
  var STOCK_TICKER = req.query.symbol;
  axios
    .get(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${STOCK_TICKER}&token=${FINNHUB_API_KEY}`
    )
    .then(function (response) {
      performValidations(response);
      res.status(200).json(response.data);
    })
    .catch(function (err) {
      performErrorHandling(res, err);
    })
    .then(function () {
    });
});

// Test API = http://localhost:3000/company/historical/data?symbol=AAPL&resolution=D&from=1631022248&to=1631627048
// Original API = https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=1631022248&to=1631627048&token=c7tk99aad3i8dq4u55d0
app.get("/company/historical/data", async (req, res) => {
  var STOCK_TICKER = req.query.symbol;
  var resolution = req.query.resolution;
  var from = req.query.from;
  var to = req.query.to;

  axios
    .get(
      `https://finnhub.io/api/v1/stock/candle?symbol=${STOCK_TICKER}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    )
    .then(function (response) {
      performValidations(response);
      let ohlc = [];
      let volume = [];
      let hourlyVariation = [];
      const o = response.data.o;
      const h = response.data.h;
      const l = response.data.l;
      const c = response.data.c;
      const v = response.data.v;
      const t = response.data.t;
      for (let i = 0; i < t.length; i++) {
        hourlyVariation.push([t[i] * 1000, c[i]]);
        ohlc.push([t[i] * 1000, o[i], h[i], l[i], c[i]]);
        volume.push([t[i] * 1000, v[i]]);
      }
      data = {
        hourlyVariation: hourlyVariation,
        ohlc: ohlc,
        volume: volume,
      };
      res.status(200).json(data);
    })
    .catch(function (err) {
      performErrorHandling(res, err);
    })
    .then(function () {
    });
});

// Test API = http://localhost:3000/company/latest-stock-price?symbol=AAPL
app.get("/company/latest-stock-price", async (req, res) => {
  var STOCK_TICKER = req.query.symbol;

  axios
    .get(
      `https://finnhub.io/api/v1/quote?symbol=${STOCK_TICKER}&token=${FINNHUB_API_KEY}`
    )
    .then(function (response) {
      performValidations(response);
      res.status(200).json(response.data);
    })
    .catch(function (err) {
      performErrorHandling(res, err);
    })
    .then(function () {
    });
});

// Test API = http://localhost:3000/company/autocomplete?q=AAPL
app.get("/company/autocomplete", async (req, res) => {
  var TICKER_QUERY = req.query.q;

  axios
    .get(
      `https://finnhub.io/api/v1/search?q=${TICKER_QUERY}&token=${FINNHUB_API_KEY}`
    )
    .then(function (response) {
      var regex = new RegExp(TICKER_QUERY);
      var commonStockData = response.data.result.filter(
        (csd) =>
          csd.type === "Common Stock" &&
          !csd.symbol.includes(".") &&
          regex.test(csd.symbol) //csd.symbol === TICKER_QUERY
      );
      res.status(200).json(commonStockData);
    })
    .catch(function (err) {
      performErrorHandling(res, err);
    })
    .then(function () {
    });
});

// Test API = http://localhost:3000/company/news?symbol=MSFT&from=2022-03-09&to=2022-03-10&count=20&filter=true
app.get("/company/news", async (req, res) => {
  var STOCK_TICKER = req.query.symbol;
  var from = req.query.from;
  var to = req.query.to;
  var count = req.query.count;
  var filter = req.query.filter;

  axios
    .get(
      `https://finnhub.io/api/v1/company-news?symbol=${STOCK_TICKER}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    )
    .then(function (response) {
      performValidations(response);
      // filtering data so that the response array only has 'count' number of news items and is filtered/unfiltered depending on the path parameter
      let countTillNow = 0;
      let responseArr = [];
      for (let temp of response.data) {
        if (filter === "true") {
          if (temp.image !== "" && temp.headline !== "") {
            responseArr.push(temp);
            countTillNow += 1;
            if (countTillNow == count) {
              break;
            }
          }
        } else {
          responseArr.push(temp);
          countTillNow += 1;
          if (countTillNow == count) {
            break;
          }
        }
      }
      res.status(200).json(responseArr);
    })
    .catch(function (err) {
      performErrorHandling(res, err);
    })
    .then(function () {
    });
});

// Test API = http://localhost:3000/company/recommendation-trends?symbol=MSFT
app.get("/company/recommendation-trends", async (req, res) => {
  var STOCK_TICKER = req.query.symbol;

  axios
    .get(
      `https://finnhub.io/api/v1/stock/recommendation?symbol=${STOCK_TICKER}&token=${FINNHUB_API_KEY}`
    )
    .then(function (response) {
      performValidations(response);

      // transforming responsse into desired format
      let period = [];
      let strongSell = [];
      let sell = [];
      let hold = [];
      let buy = [];
      let strongBuy = [];

      response.data.forEach((o) => {
        period.push(o["period"]);
        strongSell.push(o["strongSell"]);
        sell.push(o["sell"]);
        hold.push(o["hold"]);
        buy.push(o["buy"]);
        strongBuy.push(o["strongBuy"]);
      });

      newResponse = {
        name: `${STOCK_TICKER}`,
        period: period,
        strongSell: strongSell,
        sell: sell,
        hold: hold,
        buy: buy,
        strongBuy: strongBuy,
      };

      res.status(200).json(newResponse);
    })
    .catch(function (err) {
      performErrorHandling(res, err);
    })
    .then(function () {
    });
});

// Test API = http://localhost:3000/company/social-sentiment?symbol=MSFT&from=2022-01-01
app.get("/company/social-sentiment", async (req, res) => {
  var STOCK_TICKER = req.query.symbol;
  var from = req.query.from;
  axios
    .get(
      `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${STOCK_TICKER}&from=${from}&token=${FINNHUB_API_KEY}`
    )
    .then(function (response) {
      performValidations(response);
      // Calculating total, positive and negative mentions for reddit and twitters
      const redditTotalMentions = response.data.reddit
        .map((d) => d.mention)
        .reduce((a, b) => a + b, 0);
      const redditTotalPositiveMentions = response.data.reddit
        .map((d) => d.positiveMention)
        .reduce((a, b) => a + b, 0);
      const redditTotalNegativeMentions = response.data.reddit
        .map((d) => d.negativeMention)
        .reduce((a, b) => a + b, 0);

      const twitterTotalMentions = response.data.twitter
        .map((d) => d.mention)
        .reduce((a, b) => a + b, 0);
      const twitterTotalPositiveMentions = response.data.twitter
        .map((d) => d.positiveMention)
        .reduce((a, b) => a + b, 0);
      const twitterTotalNegativeMentions = response.data.twitter
        .map((d) => d.negativeMention)
        .reduce((a, b) => a + b, 0);

      // creating the response data
      const data = {
        redditMentions: redditTotalMentions,
        redditPositiveMentions: redditTotalPositiveMentions,
        redditNegativeMentions: redditTotalNegativeMentions,
        twitterMentions: twitterTotalMentions,
        twitterPositiveMentions: twitterTotalPositiveMentions,
        twitterNegativeMentions: twitterTotalNegativeMentions,
      };

      res.status(200).json(data);
    })
    .catch(function (err) {
      performErrorHandling(res, err);
    })
    .then(function () {
    });
});

// Test API = http://localhost:3000/company/peers?symbol=MSFT
app.get("/company/peers", async (req, res) => {
  var STOCK_TICKER = req.query.symbol;
  axios
    .get(
      `https://finnhub.io/api/v1/stock/peers?symbol=${STOCK_TICKER}&token=${FINNHUB_API_KEY}`
    )
    .then(function (response) {
      performValidations(response);
      res.status(200).json(response.data.filter((s) => s.length > 0));
    })
    .catch(function (err) {
      performErrorHandling(res, err);
    })
    .then(function () {
    });
});

// Test API = http://localhost:3000/company/stock/earnings?symbol=MSFT
// Todo: Replace null values to 0. Refer to HW8 description page 35
app.get("/company/stock/earnings", async (req, res) => {
  var STOCK_TICKER = req.query.symbol;
  axios
    .get(
      `https://finnhub.io/api/v1/stock/earnings?symbol=${STOCK_TICKER}&token=${FINNHUB_API_KEY}`
    )
    .then(function (response) {
      // transforming responsse into desired format
      let period = [];
      let actual = [];
      let estimate = [];
      let surprise = [];
      let surprisePercent = [];

      response.data.forEach((o) => {
        period.push(`${o["period"]}<br>Surprise: ${o["surprise"]}`);
        actual.push(o["actual"] == null ? 0 : o["actual"]);
        estimate.push(o["estimate"] == null ? 0 : o["estimate"]);
        surprise.push(o["surprise"] == null ? 0 : o["surprise"]);
        surprisePercent.push(
          o["surprisePercent"] == null ? 0 : o["surprisePercent"]
        );
      });

      newResponse = {
        name: `${STOCK_TICKER}`,
        period: period,
        actual: actual,
        estimate: estimate,
        surprise: surprise,
        surprisePercent: surprisePercent,
      };

      res.status(200).json(newResponse);
    })
    .catch(function (err) {
      console.log(err);
      performErrorHandling(res, err);
    })
    .then(function () {
    });
});

// EXPORTING app TO COMPLY IN CASE OF MULTIPLE TESTS SO THAT EACH TEST CAN START ITS OWN SERVER AT SEPARATE PORTS
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is now up and running and listening on PORT ${PORT}`);
});
