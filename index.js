const https = require('node:https');
const path = require('node:path');
const fs = require('node:fs');
const cheerio = require('cheerio');
const axios = require('axios').default;

const options = {
  host: 'memegen-link-examples-upleveled.netlify.app',
  path: '/',
};

const request = https.request(options, function fetchRequest(res) {
  let data = '';
  res.on('data', function fetchResponse(returnedData) {
    data += returnedData;
  });

  res.on('end', function () {
    const imagesUrls = []; // array containing all the urls returned from the query

    const $ = cheerio.load(data);

    $('#images div a').each((index, element) => {
      // console.log($(element));

      const extractedUrl = $(element).find('img').attr('src'); // finding the url with cheerio and push to array!
      imagesUrls.push(extractedUrl);
    });

    // console.log(imagesUrls.slice(0, 10));

    const imageNames = 'image';
    let imageNumber = 0;

    // using for of loop to loop over all the 10 sliced urls and passing each to axios as a string!
    for (const imageURL of imagesUrls.slice(0, 10)) {
      // increase imageNumber value in each iteration to generate number from 1 to 10;
      imageNumber++;

      // concatenate the imageName and each numbers and the image extension to generate different image names
      const imageFileExtension = imageNames + imageNumber + '.jpg';

      // using axio to make a get request to each image urls!
      axios({
        method: 'get',
        url: imageURL,
        responseType: 'stream',
      }).then(function getMemes(response) {
        const memesHome = './memes';

        try {
          if (!fs.existsSync(memesHome)) {
            fs.mkdirSync(memesHome);

            // if no memes folder is present then this will create a folder with that name and download the memes
            const setImagePaths = path.join(memesHome, imageFileExtension);
            response.data.pipe(fs.createWriteStream(setImagePaths));
          } else {
            // this would download the memes once a folder with name memes is present
            const setImagePaths = path.join(memesHome, imageFileExtension);
            response.data.pipe(fs.createWriteStream(setImagePaths));
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  });
});
request.on('error', function error(e) {
  console.error(e.message);
});

request.end();

// Note for my future self!
// const name = 'joe'  ## path.join('/', 'users', name, 'notes.txt') //'/users/joe/notes.txt'

// ############################################################################
/* const option = {
  url: 'https://api.memegen.link/images/ermg/ermahgerd/memes.jpg?width=300',
  dest: './memes',
};

download
  .image(option)
  .then(({ filename }) => {
    console.log('success' + filename);
  })
  .catch((err) => console.error(err));
 */

/* const imagePaths = './memes';
const getImages = (imagePath) =>
  axios({
    method: 'get',
    url: 'https://api.memegen.link/images/ermg/ermahgerd/memes.jpg?width=300',
    responseType: 'stream',
  }).then(
    console.log('are you pending'),
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(imagePath))
          .on('finish', () => resolve('Hello World!'))
          .on('error', (e) => reject(e));
      }),
  );

console.log(getImages('./memes/image2.jpg')); */

/* axios({
  method: 'get',
  url: 'https://api.memegen.link/images/ermg/ermahgerd/memes.jpg?width=300',
  responseType: 'stream',
}).then(function (response) {
  response.data.pipe(fs.createWriteStream(imageGett));
}); */

/* const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('foo');
  }, 300);
}); */
