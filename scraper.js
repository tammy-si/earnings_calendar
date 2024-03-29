const playwright = require("playwright");
const mongoose = require("mongoose");
const { connectDB } = require("./helpers/connect.js");
const Day = require("./models/dayModel.js");
const Stock = require("./models/stockModel.js");
const Week = require("./models/weekModel.js");
const ObjectId = require("mongodb").ObjectId;

async function getData() {
  await connectDB();
  /* remove the old data */
  Stock.collection.drop();
  Day.collection.drop();
  Week.collection.drop();
  // * connect to the mongoDB data base */
  const browser = await playwright.chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto("https://www.nasdaq.com/market-activity/earnings", {
    timeout: 100000,
  });
  await page.waitForSelector(".time-belt__item");
  var leftButton = await page.waitForSelector(".time-belt__prev");
  var rightButton = await page.waitForSelector(".time-belt__next");

  /* also open a page to get the logo */
  const logoPage = await browser.newPage();
  await logoPage.goto(`https://clearbit.com/logo`, {
    timeout: 100000,
  });
  logoPage.mouse.wheel((delta_x = 0), (delta_y = 300));

  // Get to the start of the current week
  while (1) {
    var timeBeltElements = await page.$$(".time-belt__item");

    // get the first and second dates in the list
    var firstDateElement = timeBeltElements[0];
    var secondDateElement = timeBeltElements[1];
    // check if it's the start of the week by comparing the difference in date
    var firstDT = await firstDateElement.getAttribute("data-day");
    var secondDT = await secondDateElement.getAttribute("data-day");
    // also get the second date's month
    var secondDTMonth = await secondDateElement.getAttribute("data-month");
    // the month and then the last day of the month before it
    var monthChange = {
      1: 31,
      2: 31,
      3: 29,
      4: 31,
      5: 30,
      6: 31,
      7: 30,
      8: 31,
      9: 31,
      10: 30,
      11: 31,
      12: 30,
    };
    datediff = secondDT - firstDT;
    // if it's the start of a week, we should move so the second date is first
    if (datediff != 1 && !(monthChange[Number(secondDTMonth)] == firstDT)) {
      // click the right button once, then break out
      await rightButton.click();
      break;
    } else {
      // click the left and keep going
      await leftButton.click();
    }
  }

  // We go for 4 weeks
  for (let w = 0; w < 4; w++) {
    await page.waitForTimeout(100);
    // each week we add a new week object with the weeks starting date
    // reselect the correct starting dates
    var timeBeltElements = await page.$$(".time-belt__item");
    // get the firstDate and have that be the key for the week
    let firstDateElement = timeBeltElements[0];
    let firstday = await firstDateElement.getAttribute("data-day");
    let firstmonth = await firstDateElement.getAttribute("data-month");
    let firstyear = await firstDateElement.getAttribute("data-year");
    var dayArray = [];
    // Now go for 5 day and collect all the week dates
    for (let j = 0; j < 5; j++) {
      var timeBeltElements = await page.$$(".time-belt__item");
      var currDateElement = timeBeltElements[0];
      /* im trying to fix a duplicated day problem here */
      for (let t = 0; t < 5; t++) {
        await currDateElement.click();
      }
      await page.waitForTimeout(100);
      let currDay = await currDateElement.getAttribute("data-day");
      let currMonth = await currDateElement.getAttribute("data-month");
      let currYear = await currDateElement.getAttribute("data-year");
      let stockArray = [];

      // get all the rows on current page
      var allRows = await page.$$(".market-calendar-table__row");
      for (let k = 0; k < allRows.length - 1; k++) {
        let currRow = allRows[k];
        let rowContent = await currRow.$$(
          ".market-calendar-table__cell-content"
        );
        /* get the time value for the row */
        let timeCell = rowContent[0];
        let timeImg = await timeCell.$("img");
        let timeValue = await timeImg.getAttribute("alt");
        /* get the symbol for the row */
        let symbolCell = rowContent[1];
        let symbolA = await symbolCell.$("a");
        let symbolValue = await symbolA.innerText();
        /* company Name*/
        let companyNameCell = rowContent[2];
        let companyNameValue = await companyNameCell.innerText();
        /* market cap */
        // have to check if the day has passed already cause market cap in different column
        const notPassed = await page.evaluate((element) => {
          return (
            element.parentElement &&
            element.parentElement.hasAttribute("data-column") &&
            element.parentElement.getAttribute("data-column") == "marketCap"
          );
        }, rowContent[3]);
        if (notPassed) {
          var marketCapCell = rowContent[3];
        } else {
          var marketCapCell = rowContent[5];
        }
        let marketCapValue = await marketCapCell.innerText();
        marketCapValue = parseInt(marketCapValue.replace(/\D/g, ""));
        /* get the logo for the stokc */
        let img_url = await getLogo(logoPage, companyNameValue);
        /* create a stock document and add the object with the data just obtained */
        const newStock = new Stock({
          _id: new ObjectId(),
          time: timeValue,
          symbol: symbolValue,
          companyName: companyNameValue,
          marketCap: isNaN(marketCapValue) ? null : marketCapValue,
          yahooLink: `https://finance.yahoo.com/quote/${symbolValue}/`,
          img_url: img_url,
        });
        newStock.save();
        /* store the objectId of the stock in the day array */
        stockArray.push(newStock._id);
      }

      /* now create the day Object */
      const newDay = new Day({
        _id: new ObjectId(),
        date: Date.parse(`${currYear}-${currMonth}-${currDay}`),
        stocks: stockArray,
      });
      /* also store this day's id so we can add it to the weekly */
      /* reconnect db just incase connection broke */
      newDay.save();
      dayArray.push(newDay._id);
      await rightButton.click();
    }

    /* now we can make the object for that week */
    const newWeek = new Week({
      _id: new ObjectId(),
      startingDay: Date.parse(`${firstyear}-${firstmonth}-${firstday}`),
      days: dayArray,
    });
    newWeek.save();
  }
  await browser.close();
  mongoose.connection.close();
}

/* logos from clearbit */
/* must attribute with <a href="https://clearbit.com">Logos provided by Clearbit</a> */
async function getLogo(logoPage, companyName) {
  // curr is a trimmed version of the companyName
  let curr = companyName;
  curr = curr.replace("Inc.", "");
  curr = curr.replace(",", "");
  curr = curr.replace("Ltd", "");
  curr = curr.replace("Corp", "");
  curr = curr.replace("Co.", "");

  await logoPage.getByPlaceholder("Enter a company name...").fill(" ");
  await logoPage.waitForTimeout(100);

  var comp;
  do {
    /* keep trimming our search down in case the full name doesn't work */
    curr = curr.slice(0, -1);
    /* no results for each string */
    if (curr.length == 0) {
      return null;
    }
    // input in
    try {
      await logoPage.getByPlaceholder("Enter a company name...").fill(curr);
    } catch {
      return null;
    }
    await logoPage.waitForTimeout(100);

    // check if search gave a result
    comp = await logoPage.$(
      '//*[@id="top"]/section[2]/div/div[2]/div[1]/div/div/div[1]'
    );
  } while (!comp && curr.length > 0);
  await logoPage.waitForTimeout(100);

  try {
    await logoPage.getByPlaceholder("Enter a company name...").fill(curr);
    await logoPage.waitForTimeout(300);

    let first = await logoPage.locator(
      '//*[@id="top"]/section[2]/div/div[2]/div[1]/div/div/div[1]'
    );

    if (!first) {
      console.log("null");
      return null;
    }

    await logoPage.click(
      '//*[@id="top"]/section[2]/div/div[2]/div[1]/div/div/div[1]',
      { timeout: 1000 }
    );

    await logoPage.waitForTimeout(300);
    var element = await logoPage.waitForSelector(
      '//*[@id="top"]/section[2]/div/div[2]/div[2]/img'
    );
  } catch {
    return null;
  }

  url = await element.getAttribute("src");

  return url;
}
getData();
