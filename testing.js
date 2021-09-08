const http = require('https');
let fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

axios
  .get('https://memegen-link-examples-upleveled.netlify.app/')
  .then((response) => {
    const $ = cheerio.load(response.data);

    $('#images div a').each((index, element) => {
      const imageUrls = $(element).find('img').attr('src');
      console.log(imageUrls);
    });
  })
  .catch((error) => {
    console.log(error);
  });
