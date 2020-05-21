//もろもろの定数
const puppeteer = require('puppeteer');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const emulateDevices = '';
//const emulateDevices = puppeteer.devices['iPhone 8'];//エミュレートするデバイスを指定
const file = './url.csv';
const basicUser = '';
const basicPass = '';
const DEFAULT_VIEWPORT = {
  width: 1000,
  height: 2000,
  deviceScaleFactor: 1,
};
const WAIT_FOR = 3000; // ページ描画の待機時間（ミリ秒）

//全体の処理を包括
!(async() => {
  try {

    const browser = await puppeteer.launch({
      // headless: false,
      defaultViewport: DEFAULT_VIEWPORT,
    });

    //CSVファイル読み取り
    const options = { columns: true };
    const records = readCsvSync(file,options);
    const totall  = records.length

    for (let i = 0; i < totall; i++) {
        await screenshotPageScroll(browser,records[i].url,records[i].title,i+1,totall);
    }

    await browser.close();
  } catch (e) {
    console.error(e)
  }
})()

/**
 * ページスクロールし、ページ全体のスクショ取得
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

  //エミュレーターの指定
  if(emulateDevices !== ''){
    await page.emulate(emulateDevices);//エミュレートするデバイスを指定
  }

  //Basic認証の設定
  if(basicUser !== '' && basicPass !== ''){
    await page.authenticate({ username: basicUser, password: basicPass });
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

  //スクショ撮って、保存
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
  const content = fs.readFileSync(filename).toString();
  return parse(content, options);
}