"use strict";

const request = require('request'),
  cheerio = require('cheerio');

let scrapper = {};

scrapper.scrape = scrape;

module.exports = exports = scrapper;


/**
 * @name scrape
 * @description scrape a website based on an url
 * @return {promise}
 */
function scrape(url, model, opts) {
  let startTime = Date.now(),
    options = opts ? opts : {},
    limit = options.limit ? options.limit : 10000;

  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) { return reject(err) }
      console.log('Time:', Date.now() - startTime);
      resolve(parse(body, model, limit));
    });
  });

}

/**
 * @name parse
 * @description fill model based on website data
 * @return {object}
 */
function parse(body, model, limit) {
  let dom = cheerio.load(body);
  Object.keys(model).forEach((modelKey) => {
    if (dom(model[modelKey].elem).length > 0) {
      let dataArray = [];
      for (var i = 0; i < dom(model[modelKey].elem).length; i++) {
        if (i === limit) { break; }
        if (model[modelKey].get && model[modelKey].get != 'html') {
          dataArray.push(dom(model[modelKey].elem).eq(i).attr(model[modelKey].get));
        } else {
          dataArray.push(dom(model[modelKey].elem).eq(i).html());
        }
      }
      model[modelKey] = dataArray
    } else {
      model[modelKey] = '';
    }
  });

  return model;
}