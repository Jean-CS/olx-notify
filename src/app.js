const Crawler = require("crawler");
const fs = require("fs");

const mail = require("./mail");
import * as constants from "./constants";

const c = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: function(err, res, done) {
    if (err) {
      console.log(err);
      done();
    }

    // $ is Cheerio by default
    // Cheerio is a lean implementation of core jQuery designed specifically for the server
    let json = setData(res.$);

    // Remove all items that do not contain the words in the constant arrays
    // Example: The search is for "macbook" and it is required for every
    //          item to have the word "mac" in it's title
    let filteredJson = json.filter(item =>
      constants.TITLE_SHOULD_CONTAIN.some(key =>
        item.title.toLowerCase().includes(key)
      )
    );

    const items = checkNewItems(filteredJson);

    if (items) notify(items);
    else console.log("No new annoucements 💔");

    fs.writeFileSync(constants.FILE_NAME, JSON.stringify(filteredJson));

    done();
  }
});

// Queue just one URL, with default callback
c.queue(constants.URL);

// Calls the email module to send an email with the new items
const notify = items => {
  mail.send(items);
};

// Compares the new json object with the server file
// and if there are new items, return them
const checkNewItems = newJson => {
  if (fs.existsSync(constants.FILE_NAME)) {
    const jsonFile = JSON.parse(fs.readFileSync(constants.FILE_NAME, "utf-8"));
    const newLength = newJson.length;
    const fileLength = jsonFile.length;

    if (newLength === fileLength) return;

    const diffLength = newLength - fileLength;

    const newItems = [];

    for (let i = 0; i < diffLength; i++) {
      newItems.push(newJson[i]);
    }

    return newItems;
  }
};

// Filters the HTML data and returns a json object
const setData = $ => {
  let jsonData = [];

  $(constants.SELECTOR_LIST).filter(function() {
    const data = $(this).children();

    data.each(function(i, element) {
      jsonData.push(addItem($(element)));
    });
  });

  return jsonData;
};

const addItem = element => {
  let tmp = {};

  tmp.title = getText(element, constants.SELECTOR_TITLE);
  tmp.region = getText(element, constants.SELECTOR_REGION)
    .split(",")
    .map(s => s.trim())
    .join(", ");
  tmp.price = getText(element, constants.SELECTOR_PRICE);
  tmp.date = getText(element, constants.SELECTOR_DATE);
  tmp.image = element.find(constants.SELECTOR_IMG).attr("src");
  tmp.url = element.find(constants.SELECTOR_URL).attr("href");
  tmp.id = setId(tmp);

  return tmp;
};

// Returns an ID based on the object properties and removes any special characters
const setId = object =>
  (object.title + object.price + object.date).replace(/[^A-Z0-9]/gi, "");

/// @element  : is a cheerio ($) object
const getText = (element, selector) =>
  element
    .find(selector)
    .text()
    .trim();
