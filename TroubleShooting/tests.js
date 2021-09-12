const cliProgress = require('cli-progress');

const path = require('node:path');
const axios = require('axios').default;
const fs = require('node:fs');
const http = require('node:https');
const cheerio = require('cheerio');

function downloadImages() {
  const options = {
    host: 'memegen-link-examples-upleveled.netlify.app',
    path: '/',
  };

  const request = http.request(options, function (res) {
    let data = '';
    res.on('data', function (returnedData) {
      data += returnedData;
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

      // loop for extracting only 10 array and pushing them to the neededUrls array!
      for (let i = 0; i < imagesUrls.length; i++) {
        if (i < 10) {
          neededUrls.push(imagesUrls[i]);
        }
      }

      // console.log(neededUrls);

      const imageNames = 'image';
      let imageNumber = 0;

      // using for of loop to loop over all the 10 extracted urls and passing each to axios as a string!
      for (const imageURLS of neededUrls) {
        // increase imageNumber value in each iteration to generate number from 1 to 10;
        imageNumber++;

        // concatenate the imageName and each numbers and the image extension to generate different image names
        const imageFileExtension = imageNames + imageNumber + '.jpg';

        // using axio to make a get request to each image urls!
        axios({
          method: 'get',
          url: imageURLS,
          responseType: 'stream',
        }).then(function (response) {
          const memesHome = './memes';
          const imageNewName = imageFileExtension;

          // setting the path and passing it to writestream to write the images to the needed location!
          const setImagePaths = path.join(memesHome, imageNewName);
          response.data.pipe(fs.createWriteStream(setImagePaths));
        });
      }
    });
  });
  request.on('error', function (e) {
    console.log(e.message);
  });

  request.end();
}
// ###################################################

function Example2(onComplete) {
  // console.log('\nExample 2 - Custom configuration');

  // create new progress bar using default values
  const progressBar = new cliProgress.Bar({
    barCompleteChar: '#',
    barIncompleteChar: '_',
    format: 'Current Upload Progress: {percentage}%' + ' - ' + '{bar}',
    fps: 5,
    stream: process.stdout,
    barsize: 20,
  });

  if (progressBar.format < 1) {
    console.log('hello right nmow');
  }

  const number = 10;

  progressBar.start(100, number);

  // 50ms update rate
  const timer = setInterval(function () {
    // increment value
    progressBar.increment();

    // set limit
    if (progressBar.value >= progressBar.getTotal()) {
      // stop timer
      clearInterval(timer);

      progressBar.stop();

      // run complete callback
      // onComplete.apply(this);
    }
  }, 50);
}

console.log(Example2(downloadImages()));
