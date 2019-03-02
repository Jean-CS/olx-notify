const Crawler = require("crawler");

const json = { title: "", region: "", price: "", date: "" };

const c = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: function(error, res, done) {
    if (error) {
      console.log(error);
    } else {
      const $ = res.$;
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server

      $("#main-ad-list").filter(function() {
        const data = $(this);
        const first = data.children().first();

        json.title = first
          .find(".col-2 h2")
          .text()
          .trim();

        json.region = first
          .find(".col-2 .detail-region")
          .text()
          .trim();

        json.price = first
          .find(".col-3 p")
          .text()
          .trim();

        json.date = first
          .find(".col-4")
          .children()
          .first()
          .text();

        console.log(json);
      });
    }
    done();
  }
});

// Queue just one URL, with default callback
c.queue(
  "https://pr.olx.com.br/regiao-de-londrina/computadores-e-acessorios?q=macbook"
);
