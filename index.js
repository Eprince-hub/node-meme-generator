const http = require('https');
let fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

const options = {
  host: 'memegen-link-examples-upleveled.netlify.app',
  path: '/',
};

const request = http.request(options, function (res) {
  let data = '';
  res.on('data', function (chunk) {
    data += chunk;
    // console.log(data);
  });

  res.on('end', function () {
    const imagesUrls = []; // array containing all the urls returned from the query

    const neededUrls = []; // array containing the needed 10 urls

    const $ = cheerio.load(data);

    $('#images div a').each((index, element) => {
      // console.log($(element));
      const extractedUrl = $(element).find('img').attr('src'); // finding the url with cheerio and push to array!
      imagesUrls.push(extractedUrl);
    });

    // loop for ectracting only 10 array and pushing them to the neededUrls array!
    for (let i = 0; i < imagesUrls.length; i++) {
      if (i < 10) {
        neededUrls.push(imagesUrls[i]);
      }
    }

    console.log(neededUrls);
    fs.writeFile('./memes/memes.json', JSON.stringify(neededUrls), (error) => {
      if (error) throw error;
    });
  });
});
request.on('error', function (e) {
  console.log(e.message);
});

request.end();
