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
const URL =
  "https://pr.olx.com.br/regiao-de-londrina/computadores-e-acessorios?q=macbook";
const TITLE_SHOULD_CONTAIN = ["mac"];

exports = {
  SELECTOR_DATE,
  SELECTOR_IMG,
  SELECTOR_LIST,
  SELECTOR_PRICE,
  SELECTOR_REGION,
  SELECTOR_TITLE,
  SELECTOR_URL,
  FILE_NAME,
  URL,
  TITLE_SHOULD_CONTAIN
};
