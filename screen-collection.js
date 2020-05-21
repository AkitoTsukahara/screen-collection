const puppeteer = require('puppeteer');
const emulateDevices = puppeteer.devices['iPhone 8'];//エミュレートするデバイスを指定
const file = './url.csv';


const DEFAULT_VIEWPORT = {
  width: 1000,
  height: 2000,
  deviceScaleFactor: 1,
};

const WAIT_FOR = 3000; // ページ描画の待機時間（ミリ秒）

!(async() => {
  try {

    const browser = await puppeteer.launch({
      // headless: false,
      defaultViewport: DEFAULT_VIEWPORT,
    });

    //CSVファイル読み取り
    const options = { columns: true };
    const records = readCsvSync(file,options);

    for (let i = 0; i < records.length; i++) {
        await screenshotPageScroll(browser,records[i].url,records[i].title,i+1,records.length);
    }

    await browser.close();
  } catch (e) {
    console.error(e)
  }
})()

/**
 * ページスクロールし、ページ全体のキャプチャ取得
 * @param browser
 * @param url
 * @param title
 * @param number
 * @param all
 * @returns {Promise<void>}
 */
async function screenshotPageScroll(browser,url,title,number,all) {
  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();
  if(emulateDevices !== ''){
    await page.emulate(emulateDevices);//エミュレートするデバイスを指定
  }
  await page.goto(url, {waitUntil: 'networkidle2'});

  await page.evaluate(() => {
    let lastScrollTop = document.scrollingElement.scrollTop;

    // ページ全長を取得
    const scroll = () => {
      document.scrollingElement.scrollTop += 100;
      if (document.scrollingElement.scrollTop !== lastScrollTop) {
        lastScrollTop = document.scrollingElement.scrollTop;
        requestAnimationFrame(scroll);
      }
    };
    scroll();
  });

  await page.waitFor(WAIT_FOR); // ページ描画の待機

  await page.screenshot({
    path: './screen/'+title+'.png',
    fullPage: true
  });

  //進捗メッセージ
  console.log('title: '+title+' done')
  console.log(number+'/'+all+' finshed')

  await context.close();
  return;
}

/**
 * CSVファイル読み取り
 * @param filename
 * @param options
 */
function readCsvSync(filename, options) {
  const fs = require('fs');
  const parse = require('csv-parse/lib/sync');
  const content = fs.readFileSync(filename).toString();
  return parse(content, options);
}