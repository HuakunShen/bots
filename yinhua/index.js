import puppeteer from "puppeteer";

async function get_page(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(url);
  page.on("console", async (message) => {
    const log = await message.args()[0].jsonValue();
    if (log) {
      const m3u8_url = log.filter((item) => item["src_site"] === "tkzy2")[0]
        .play_data;
      console.log(m3u8_url);
    }
  });
}

async function extract_m3u8(page) {
  const links = await page.$$eval(".ep-panel.mb-3 a", (e) =>
    e.map((a) => a.getAttribute("href"))
  );
  const m3u8Links = links.filter((link) => link && link.includes(".m3u8"));
  return m3u8Links;
}

async function extract_playlist_links(page) {
  const links = await page.$$eval(".ep-panel.mb-3 a", (e) =>
    e.map((a) => a.getAttribute("href"))
  );
  const playlistLinks = links.filter(
    (link) => link && link.includes("/vod-play/")
  );
  return playlistLinks;
}

async function getM3u8(url) {
  const browser = await puppeteer.launch();
  const newPage = await browser.newPage();
  newPage.goto(url);
  const m3u8s = await extract_m3u8(newPage);
  const m3u8 = m3u8s
    .filter((url2) => url2.includes("v8.dious.cc"))
    .map((url2) => url2.slice(12))[0];
  await browser.close();
  return m3u8;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const domain = "https://yhdm.one";
  // Navigate the page to a URL
  await page.goto("https://yhdm.one/vod-play/2019381994/ep6.html");
  const paylistLinks = await extract_playlist_links(page);
  //   console.log(paylistLinks);
  const concatLinks = paylistLinks.map((link) => domain + link);
  //   console.log(concatLinks);
  //   await browser.close();
  //   const m3u8s = await Promise.all(concatLinks.map((url) => getM3u8(url)));
  //   console.log(m3u8s);
  //   for (const url of concatLinks.slice(0, 1)) {
  //     getM3u8(url).then((m3u8) => console.log(m3u8));
  //   }
  const finalList = [];
  for (const url of concatLinks) {
    await page.goto(url);
    const htmlName = url.split("/").at(-1);
    console.log(htmlName);
    await sleep(1000);
    const m3u8s = await extract_m3u8(page);
    // console.log(url, m3u8s);
    const m3u8 = m3u8s
      .filter((url2) => url2.includes("v8.dious.cc"))
      .map((url2) => url2.slice(12))[0];
    console.log(m3u8);
    finalList.push({
      m3u8,
      htmlName,
    });
  }
  console.log(finalList);
  await browser.close();
  finalList
    .filter((x) => x)
    .forEach((item) => {
      const filename = item.htmlName.split(".").at(0);
      console.log(`youtube-dl ${item.m3u8} -o ${filename}.mp4`);
    });
  //   for (const url of concatLinks) {
  //     const htmlName = url.split("/").at(-1);
  //     const newPage = await browser.newPage()
  //     newPage.goto(url);
  //     const m3u8s = await extract_m3u8(newPage);
  //     const m3u8 = m3u8s
  //       .filter((url2) => url2.includes("v8.dious.cc"))
  //       .map((url2) => url2.slice(12))[0];
  //     console.log(m3u8);
  //   }
})();
