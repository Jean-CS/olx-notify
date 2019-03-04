const Crawler = require("crawler");
const fs = require("fs");

const SELECTOR_LIST = "#main-ad-list";
const SELECTOR_TITLE = ".col-2 h2";
const SELECTOR_REGION = ".col-2 .detail-region";
const SELECTOR_PRICE = ".col-3 p";
const SELECTOR_DATE = ".col-4 p:first-of-type";
const SELECTOR_IMG = ".col-1 .image";
const SELECTOR_URL = ".item > a";
const FILE_NAME = "results.json";

// { id: "", title: "", region: "", price: "", date: "", image: "", url: "" }
//const json = [];
const url =
  "https://pr.olx.com.br/regiao-de-londrina/computadores-e-acessorios?q=macbook";

const c = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: function(err, res, done) {
    if (err) {
      console.log(err);
      done();
    }

    // $ is Cheerio by default
    // a lean implementation of core jQuery designed specifically for the server
    let json = setData(res.$);

    checkNewItems(json);

    fs.writeFileSync(FILE_NAME, JSON.stringify(json));

    done();
  }
});

// Queue just one URL, with default callback
c.queue(url);

const checkNewItems = newJson => {
  if (fs.existsSync(FILE_NAME)) {
    const jsonFile = JSON.parse(fs.readFileSync(FILE_NAME, "utf-8"));
    const newLength = newJson.length;
    const fileLength = jsonFile.length;

    if (newLength === fileLength) return;

    const diffLength = newLength - fileLength;

    const newItems = [];

    for (let i = 0; i < diffLength; i++) {
      newItems.push(newJson[i]);
    }
  }
};

const setData = $ => {
  let jsonData = [];

  $(SELECTOR_LIST).filter(function() {
    const data = $(this).children();

    data.each(function(i, element) {
      jsonData.push(addItem($(element)));
    });
  });

  return jsonData;
};

const addItem = element => {
  let tmp = {};

  tmp.title = getText(element, SELECTOR_TITLE);
  tmp.region = getText(element, SELECTOR_REGION)
    .split(",")
    .map(s => s.trim())
    .join(", ");
  tmp.price = getText(element, SELECTOR_PRICE);
  tmp.date = getText(element, SELECTOR_DATE);
  tmp.image = element.find(SELECTOR_IMG).attr("src");
  tmp.url = element.find(SELECTOR_URL).attr("href");
  tmp.id = setId(tmp);

  return tmp;
};

const setId = object =>
  (object.title + object.price + object.date).replace(/[^A-Z0-9]/gi, "");

/// @element  : is a cheerio ($) object
const getText = (element, selector) =>
  element
    .find(selector)
    .text()
    .trim();
