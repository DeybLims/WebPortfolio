import { existsSync } from "node:fs";
import { chromium, devices } from "playwright-core";

const url = process.env.MOBILE_CHECK_URL ?? "http://127.0.0.1:3000";
const chrome =
  process.env.CHROME_PATH ||
  ["/usr/bin/google-chrome", "/usr/local/bin/google-chrome"].find((path) => existsSync(path));
const iphone = devices["iPhone 13"];

const targets = [
  { name: "iPhone 13", mobile: true, ...iphone },
  { name: "Pixel 7", mobile: true, ...devices["Pixel 7"] },
  {
    name: "440",
    mobile: true,
    userAgent: iphone.userAgent,
    viewport: { width: 440, height: 956 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
  {
    name: "375",
    mobile: true,
    userAgent: iphone.userAgent,
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
  {
    name: "desktop",
    mobile: false,
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
];

const browser = await chromium.launch({
  ...(chrome ? { executablePath: chrome } : { channel: "chrome" }),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let failed = false;

for (const target of targets) {
  const { name, mobile, ...device } = target;
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
    const ok = box.scrollWidth <= box.clientWidth && (!mobile || box.innerWidth <= box.clientWidth + 1);
    console.log(
      `${ok ? "ok" : "FAIL"} ${name} ${theme}: scrollWidth ${box.scrollWidth} clientWidth ${box.clientWidth} innerWidth ${box.innerWidth}`,
    );
    if (!ok) failed = true;

    if (await page.locator(".heat-grid").count()) {
      const labels = await page.evaluate(async () => {
        await document.fonts.ready;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dow = [...document.querySelectorAll(".heat-dow")].find((node) => node.textContent === "Mon");
        const dowSize = dow ? getComputedStyle(dow).fontSize : "";
        const visible = [...document.querySelectorAll(".heat-month-label")].map((node) => {
          const rect = node.getBoundingClientRect();
          const cell = node.closest(".heat-month");
          const cellRect = cell?.getBoundingClientRect();
          return {
            text: node.textContent ?? "",
            fontSize: getComputedStyle(node).fontSize,
            whiteSpace: getComputedStyle(node).whiteSpace,
            lines: node.getClientRects().length,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            cellLeft: cellRect?.left ?? 0,
            fits: rect.width <= (cellRect?.width ?? 0) + 0.5,
          };
        });
        let overlap = false;
        for (let i = 0; i < visible.length; i += 1) {
          for (let j = i + 1; j < visible.length; j += 1) {
            const a = visible[i];
            const b = visible[j];
            if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) {
              overlap = true;
            }
          }
        }
        const problems = visible.filter(
          (label) =>
            !months.includes(label.text) ||
            label.lines !== 1 ||
            label.whiteSpace !== "nowrap" ||
            label.fontSize !== dowSize ||
            !label.fits ||
            Math.abs(label.left - label.cellLeft) > 1,
        );
        return { count: visible.length, overlap, problems, dowSize };
      });
      const labelsOk = labels.count > 0 && !labels.overlap && labels.problems.length === 0;
      console.log(
        `${labelsOk ? "ok" : "FAIL"} ${name} ${theme} labels: ${labels.count} visible${labels.overlap ? " overlap" : ""}${labels.problems.length ? ` problems ${JSON.stringify(labels.problems)}` : ""}`,
      );
      if (!labelsOk) failed = true;
    }
  }
  await context.close();
}

await browser.close();
if (failed) process.exit(1);
