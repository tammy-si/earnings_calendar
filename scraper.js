const playwright = require("playwright");

// Stock info for the next 8 weeks, will be filled with day objects
/*
weeklyData
Key: week start date
Value: a list filled with dailyStocks objects

dailyStock 
Key: day date
Value: list of stock objects

Stock
properties:
symbol,
name,
market cap,
logo_url,
report_date,
time_reporting
*/
var weeklyData = {};

async function getData() {
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

  // Get to the start of the current week
  while (1) {
    var timeBeltElements = await page.$$(".time-belt__item");

    // get the first and second dates in the list
    var firstDateElement = timeBeltElements[0];
    var secondDateElement = timeBeltElements[1];
    // check if it's the start of the week by comparing the difference in date
    var firstDT = await firstDateElement.getAttribute("data-day");
    var secondDT = await secondDateElement.getAttribute("data-day");
    datediff = secondDT - firstDT;
    // if it's the start of a week, we should move so the second date is first
    if (datediff != 1) {
      // click the right button once, then break out
      await rightButton.click();
      break;
    } else {
      // click the left and keep going
      await leftButton.click();
    }
  }

  // We go for 8 weeks
  for (let w = 0; w < 8; w++) {
    // each week we add a new week object with the weeks starting date
    // reselect the correct starting dates
    var timeBeltElements = await page.$$(".time-belt__item");
    // get the firstDate and have that be the key for the week
    let firstDateElement = timeBeltElements[0];
    let firstday = await firstDateElement.getAttribute("data-day");
    let firstmonth = await firstDateElement.getAttribute("data-month");
    let firstyear = await firstDateElement.getAttribute("data-year");
    weeklyData[`${firstyear}-${firstmonth}-${firstday}`] = {};
    // Now go for 5 day and collect all the week dates
    for (let j = 0; j < 5; j++) {
      var timeBeltElements = await page.$$(".time-belt__item");
      let currDateElement = timeBeltElements[0];
      let currDay = await currDateElement.getAttribute("data-day");
      let currMonth = await currDateElement.getAttribute("data-month");
      let currYear = await currDateElement.getAttribute("data-year");
      weeklyData[`${firstyear}-${firstmonth}-${firstday}`][
        `${currYear}-${currMonth}-${currDay}`
      ] = [];
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

        /* now with the values we just obtained, add to the daily data */
        weeklyData[`${firstyear}-${firstmonth}-${firstday}`][
          `${currYear}-${currMonth}-${currDay}`
        ].push({
          time: timeValue,
          symbol: symbolValue,
          companyName: companyNameValue,
          marketCap: marketCapValue,
        });
      }
      await rightButton.click();
    }
  }
  console.log(weeklyData);
  await browser.close();
}

getData();
