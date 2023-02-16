import fs from 'fs';
import dns from 'dns';
import http from 'https';

const TEN_MINUTES_MS = 10 * 60 * 1000;

run();

function run() {
  dns.resolveTxt('next.scheduleduptime.com', (err, records) => {
    const [beginIso8601,endIso8601] = records[0][0].split(',');
    const begin = new Date(beginIso8601);
    const now = new Date();

    const msUntil = (begin - now) + TEN_MINUTES_MS;
    console.log(`Next download scheduled in ${msUntil / 1000} seconds`);
    setTimeout(() => {
      retreivePage();
      run();
    }, msUntil);
  });
}

function retreivePage() {
  http.get('https://scheduleduptime.com', (res) => {
    const { statusCode } = res;
    if (statusCode !== 200) {
      res.resume();
      return;
    }

    const file = fs.createWriteStream('scheduleduptime.html');
    res.pipe(file);
  });
}
