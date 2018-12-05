//also inject css and script for tradeoffers
let inject = document.createElement('script');
inject.src = chrome.extension.getURL('./tradeofferList.js');
inject.onload = function () { this.remove() };
(document.head || document.documentElement).appendChild(inject);

let css = document.createElement('link');
css.href = chrome.runtime.getURL('keys-dota2.css');
css.rel = 'stylesheet';
css.type = 'text/css';
(document.head || document.documentElement).appendChild(css);

//update prices cache
chrome.runtime.sendMessage(chrome.runtime.id, {method: 'prices'}, function (res) {
  localStorage.setItem('keys-dota2-prices', JSON.stringify(res.feed.entry));
});

//sync storages
chrome.storage.sync.get(['keys_dota2_currency', 'keys_dota2_discount'], function(res) {
  localStorage.setItem('keys_dota2_currency', res.keys_dota2_currency);
  localStorage.setItem('keys_dota2_discount', res.keys_dota2_discount);
});
