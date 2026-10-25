import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const VIDEO = "file:///C:/Users/desac/Downloads/threadsdownloader.com_5e66c3.mp4";
const OUT = "tmp/newsletter-ref";
const TIMES = [3.6, 4.2, 4.8, 5.4, 6.0, 6.6, 7.2, 7.8];

mkdirSync(OUT, { recursive: true });

async function run(launchOpts: Parameters<typeof chromium.launch>[0]) {
  const browser = await chromium.launch(launchOpts);
  const page = await browser.newPage({ viewport: { width: 720, height: 720 } });
  await page.setContent(
    `<body style="margin:0;background:#222"><video id="v" src="${VIDEO}" style="width:720px" muted playsinline></video></body>`
  );
  const ready = await page
    .waitForFunction(
      () => {
        const v = document.getElementById("v") as HTMLVideoElement | null;
        return !!v && v.readyState >= 2 && v.videoWidth > 0;
      },
      null,
      { timeout: 15000 }
    )
    .then(() => true)
    .catch(() => false);

  if (!ready) {
    await browser.close();
    return false;
  }

  for (const t of TIMES) {
    await page.evaluate(async (time) => {
      const v = document.getElementById("v") as HTMLVideoElement;
      await new Promise<void>((resolve) => {
        const done = () => resolve();
        v.addEventListener("seeked", done, { once: true });
        v.currentTime = time;
        setTimeout(done, 3000);
      });
    }, t);
    const box = await page.locator("#v").boundingBox();
    await page.screenshot({
      path: `${OUT}/frame-${t.toFixed(1)}s.png`,
      clip: box ?? undefined,
    });
  }

  await browser.close();
  return true;
}

const ok = await run({ headless: true }).catch(() => false);
if (!ok) {
  console.log("default chromium gagal, coba channel chrome");
  const ok2 = await run({ headless: true, channel: "chrome" }).catch((e) => {
    console.error(e);
    return false;
  });
  console.log(ok2 ? "OK via chrome" : "GAGAL");
} else {
  console.log("OK via chromium");
}
