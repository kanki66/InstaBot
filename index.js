const puppeteer = require('puppeteer');
const credentials = require('./credentials');

let sessionCookies;

(async () => {
  const browser = await puppeteer.launch({
      headless: false
  });
  const page = await browser.newPage();
  //page.setViewport({height: 1080, width: 1920});

  if (sessionCookies) {
    await page.setCookie(...sessionCookies);
    await page.goto('https://instagram.com');
  } else {
    await page.goto('https://www.instagram.com/accounts/login/');
  
    await page.waitFor(() => document.querySelectorAll('input').length);
  
    await page.type('[name=username]', credentials.username);
    await page.type('[name=password]', credentials.password);
    /*Alt
    await page.evaluate(() => {
        //login button
        document.querySelector('[class="_0mzm- sqdOP  L3NKy       "]').click();
    });*/
  
    const linkHandler = await page.$x('//button[contains(text(), "Anmelden")]');
    await linkHandler[0].click();

    await page.waitFor(() => document.querySelector('[role=dialog]'));
  
    await page.evaluate(() => {  //muss net sein falls follower und so geguckt werden soll
      //document.querySelector('[class="aOOlW  bIiDR  "').click()
    });
  }
  
  await page.waitFor(() => document.querySelector('[placeholder=Suchen]'));
  
  sessionCookies = await page.cookies();

  //await page.type('[placeholder=Suchen]', credentials.likeforfollow);
  await page.goto('https://www.instagram.com/explore/tags/likeforwollow/');
  await page.waitFor(() => document.querySelector('[role=main]'));

  const linkHandler = await page.$x('//a[@href]');
  await linkHandler[0].click();

  while(1) {
    await page.waitFor(() => document.querySelector('div[role=dialog]').childNodes[1].querySelector('section > span > button'));
    await page.waitFor(1000);
    await page.evaluate(() => document.querySelector('div[role=dialog]').childNodes[1].querySelector('section > span > button').click());
    await page.waitFor(250);
    const linkHandler = await page.$x('//button[contains(text(), "Folgen")]');
    await linkHandler[linkHandler.length-1].click();
    await page.waitFor(500);
    const next = await page.$x('//a[contains(text(), "Weiter")]');
    await next[0].click();
  } 

  /*for (var i = 0; i < linkHandler.length; i++) {
    linkHandler[i].click();
    await page.waitFor(40000);
  }*/
  
  await page.waitFor(40000);
  //await browser.close();
})();