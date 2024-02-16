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
    weeklyData[`${firstmonth}-${firstday}`] = [];
    // Now go for 5 day and collect all the week dates
    for (let j = 0; j < 5; j++) {
      var timeBeltElements = await page.$$(".time-belt__item");
      let currDateElement = timeBeltElements[0];
      let currDay = await currDateElement.getAttribute("data-day");
      let currMonth = await currDateElement.getAttribute("data-month");
      console.log(currMonth, currDay);
      await rightButton.click();
    }
  }
  await browser.close();
}

getData();
