import { existsSync } from "node:fs";
import { chromium, devices } from "playwright-core";

const url = process.env.MOBILE_CHECK_URL ?? "http://127.0.0.1:3000";
const chrome =
  process.env.CHROME_PATH ||
  ["/usr/bin/google-chrome", "/usr/local/bin/google-chrome"].find((path) => existsSync(path));

const weeks = 53;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let head = "<th></th>";
for (let i = 0; i < weeks; i++) head += `<th scope="col">${i % 4 === 0 ? months[(i / 4) | 0] : ""}</th>`;
let body = "";
for (let row = 0; row < 7; row++) {
  body += `<tr><th scope="row">${row % 2 ? "Mon" : ""}</th>`;
  for (let column = 0; column < weeks; column++) body += '<td class="heat-cell" data-level="1"></td>';
  body += "</tr>";
}
const heatTable = `<table class="heat-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;

const browser = await chromium.launch({
  ...(chrome ? { executablePath: chrome } : { channel: "chrome" }),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let failed = false;

for (const name of ["iPhone 13", "Pixel 7"]) {
  const context = await browser.newContext({ ...devices[name] });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });

  const check = async (label) => {
    const box = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    const ok = box.scrollWidth <= box.innerWidth;
    console.log(`${ok ? "ok" : "FAIL"} ${name} ${label}: scrollWidth ${box.scrollWidth} innerWidth ${box.innerWidth}`);
    if (!ok) failed = true;
  };

  for (const theme of ["light", "dark"]) {
    await page.evaluate((next) => document.documentElement.classList.toggle("dark", next === "dark"), theme);
    await check(`${theme} top`);
    for (const id of ["#projects", "#writing", "#record", "#contact"]) {
      if (await page.locator(id).count()) {
        await page.locator(id).scrollIntoViewIfNeeded();
        await check(`${theme} ${id}`);
      }
    }
  }

  await page.evaluate((html) => {
    let wrap = document.querySelector(".heat-wrap");
    if (!wrap) {
      const host = document.querySelector("#record .min-w-0") || document.querySelector("#record");
      if (!host) return;
      host.insertAdjacentHTML("beforeend", '<div class="activity"><div class="activity-heat"><div class="heat-wrap"></div></div></div>');
      wrap = document.querySelector(".heat-wrap");
    }
    if (wrap && !wrap.querySelector(".heat-table")) wrap.innerHTML = html;
  }, heatTable);
  await check("calendar");
  await context.close();
}

await browser.close();
if (failed) process.exit(1);
