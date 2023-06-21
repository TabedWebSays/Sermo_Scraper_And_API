const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.sanego.de/Arzt/?q=emmanue&l=&btn=Seek");

  // Wait for the content to be loaded
  await page.waitForSelector(".content");

  const data = await page.evaluate(() => {
    const resultList = document.querySelector(".content #doctorList .doctorSearchResult ul.resultList");
    const items = resultList.querySelectorAll("li.row.showRestCont");

    const results = [];

    items.forEach((item) => {
      const titleElement = item.querySelector(".name.col-xs-8.col-sm-8.greedyLink h3 a");
      const descDiv = item.querySelector(".desc.col-xs-9.col-sm-5");

      let title = "";
      let address = "";
      let specialization = "";

      if (titleElement) {
        title = titleElement.textContent.trim();
      }

      if (descDiv) {
        const addressElement = descDiv.querySelector("address");
        if (addressElement) {
          address = addressElement.textContent.trim();
        }

        const specializationElement = descDiv.querySelector("div[title]");
        if (specializationElement) {
          specialization = specializationElement.getAttribute("title");
        }
      }

      results.push({
        title,
        address,
        specialization,
      });
    });

    return results;
  });

  console.log(data);

  await browser.close();
}

run();
