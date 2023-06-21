const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://www.arzt-auskunft.de/arzt-auskunft/suche_sn/index.js?a=DL&Ft=Emilio&Ft_e=&Ftg=Zabitz&Ftg_e=CatId9%3A%3AZabitz%3A%3A51.7851196%3A%3A11.924088%3B"
  );

  // Wait for the divs to be loaded
  await page.waitForSelector(".card.dl.mb-3");

  // Extract the data
  const data = await page.evaluate(() => {
    const cardDivs = document.querySelectorAll(".card.dl.mb-3");
    const results = [];

    cardDivs.forEach((cardDiv) => {
      const titleElement = cardDiv.querySelector(".col-sm-4.py-3 strong a");
      const urlElement = cardDiv.querySelector(".col-sm-4.py-3 strong a");
      const specializationElement = cardDiv.querySelector(".col-sm-4.py-3 span");
      const telElement = cardDiv.querySelector(".col-sm-4.py-3 svg.bi.flex-shrink-0 + a");

      let title = '';
      if (titleElement) {
        title = titleElement.textContent.trim();
      }

      let url = '';
      if (urlElement) {
        url = urlElement.href;
      }

      let specialization = '';
      if (specializationElement) {
        specialization = specializationElement.textContent.trim();
      }

      let telNumber = '';
      if (telElement) {
        telNumber = telElement.textContent.trim();
      }

      

      results.push({
        title,
        url,
        specialization,
        telNumber
      });
    });

    return results;
  });

  console.log(data);

  await browser.close();
}

run();
