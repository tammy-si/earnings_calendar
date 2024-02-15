import puppeteer from "puppeteer";

const getData = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  await page.goto("https://www.nasdaq.com/market-activity/earnings", {
    waitUntil: "domcontentloaded",
  });
};

getData();
