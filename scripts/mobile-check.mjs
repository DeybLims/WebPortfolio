import { existsSync } from "node:fs";
import { chromium, devices } from "playwright-core";

const url = process.env.MOBILE_CHECK_URL ?? "http://127.0.0.1:3000";
const chrome =
  process.env.CHROME_PATH ||
  ["/usr/bin/google-chrome", "/usr/local/bin/google-chrome"].find((path) => existsSync(path));
const iphone = devices["iPhone 13"];

const targets = [
  { name: "iPhone 13", ...iphone },
  { name: "Pixel 7", ...devices["Pixel 7"] },
  {
    name: "440",
    userAgent: iphone.userAgent,
    viewport: { width: 440, height: 956 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
  {
    name: "375",
    userAgent: iphone.userAgent,
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
];

const browser = await chromium.launch({
  ...(chrome ? { executablePath: chrome } : { channel: "chrome" }),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let failed = false;

for (const target of targets) {
  const { name, ...device } = target;
  const context = await browser.newContext(device);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });
  for (const id of ["#projects", "#writing", "#skills", "#record", "#architecture", "#live-ide", "#experience", "#contact"]) {
    const section = page.locator(id);
    if (await section.count()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
    }
  }
  if (await page.getByRole("heading", { name: "Last 52 weeks" }).count()) {
    await page.locator("#record").scrollIntoViewIfNeeded();
    await page.waitForSelector(".heat-grid", { timeout: 8_000 });
  }
  for (const selector of [".arch-stage", ".cm-content"]) {
    try {
      await page.waitForSelector(selector, { timeout: 8_000 });
    } catch {
      console.log(`miss ${name} ${selector}`);
    }
  }

  for (const theme of ["light", "dark"]) {
    await page.evaluate((next) => {
      document.documentElement.classList.toggle("dark", next === "dark");
      window.scrollTo(0, document.body.scrollHeight);
    }, theme);
    const box = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      innerWidth: window.innerWidth,
    }));
    const ok = box.scrollWidth <= box.clientWidth && box.innerWidth <= box.clientWidth + 1;
    console.log(
      `${ok ? "ok" : "FAIL"} ${name} ${theme}: scrollWidth ${box.scrollWidth} clientWidth ${box.clientWidth} innerWidth ${box.innerWidth}`,
    );
    if (!ok) failed = true;
  }
  await context.close();
}

await browser.close();
if (failed) process.exit(1);
