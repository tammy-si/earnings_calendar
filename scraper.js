const playwright = require("playwright");

async function getData() {
  const browser = await playwright.chromium.launch({
    headless: false, // set this to true
  });

  const page = await browser.newPage();
  await page.goto("https://www.nasdaq.com/market-activity/earnings");
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
      // reselect the correct starting dates
      var timeBeltElements = await page.$$(".time-belt__item");
      var firstDateElement = timeBeltElements[0];
      var secondDateElement = timeBeltElements[1];
      break;
    } else {
      // click the left and keep going
      await leftButton.click();
    }
  }

  await browser.close();
}

getData();
