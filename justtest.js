const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Given data saved in file 'index.html' in current path
 */
fs.readFile('index.html', { encoding: 'utf-8' }, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  const $ = cheerio.load(data);

  /**
   * Print what you desire
   */
  console.log($('h2 a').text()); // Title text

  console.log(
    $('div.detail_loop')
      .contents()
      .filter(function () {
        return this.type === 'text';
      })
      .text(),
  ); // Description content (without child nodes--only text)

  console.log($('img').attr('src')); // Image source
});
