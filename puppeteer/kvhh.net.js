const puppeteer = require("puppeteer");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.kvhh.net/de/physicianfinder.html?name=&location=");

  // Wait for the content to be loaded
  await page.waitForSelector("ol.results___Z4wCB li");

  const data = await page.evaluate(() => {
    const resultList = document.querySelector("ol.results___Z4wCB");
    const items = resultList.querySelectorAll("li");

    const results = [];

    items.forEach((item) => {
      const titleElement = item.querySelector("h2.headline___34TvG");
      const specializationElement = item.querySelector(".content1___3ePx6");
      const content2Element = item.querySelector(".content2___1J4BV");

      let title = "";
      let specialization = "";
      let telephone = "";
      let website = "";

      if (titleElement) {
        title = titleElement.textContent.trim();
      }

      if (specializationElement) {
        specialization = specializationElement.textContent.trim();
      }

      if (content2Element) {
        const telephoneElement = content2Element.querySelector("a");
        if (telephoneElement) {
          telephone = telephoneElement.textContent.trim();
        }

        const content2Text = content2Element.textContent.trim();

        const websiteMatch = content2Text.match(/Website:\s*(.*)/i);
        if (websiteMatch) {
          website = websiteMatch[1].trim();
        }
      }

      results.push({
        title,
        specialization,
        telephone,
        website,
      });
    });

    return results;
  });

  console.log(data);

  await browser.close();

  // Write data to CSV file
  const csvWriter = createCsvWriter({
    path: "data.csv",
    header: [
      { id: "title", title: "Title" },
      { id: "specialization", title: "Specialization" },
      { id: "telephone", title: "Telephone" },
      { id: "website", title: "Website" },
    ],
  });

  await csvWriter.writeRecords(data);
  console.log("Data written to CSV file.");
}

run();
