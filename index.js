// Make requests to background scripts, that can make external requests
// requests are separated to prevent losing all data on unexpected error

const ID = chrome.runtime.id;

chrome.runtime.sendMessage(ID, {method: 'prices'}, function (res) {
  localStorage.setItem('keys-dota2-prices', JSON.stringify(res.feed.entry));
});

chrome.runtime.sendMessage(ID, {method: 'bots'}, function (res) {
  let bots = res.feed.entry.reduce((obj, itm) => {
        obj[itm.gsx$steamid.$t] = itm.gsx$type.$t
        return obj;
  }, {});
  localStorage.setItem('keys-dota2-bots', JSON.stringify(bots));
});

// Some custom info
const CURR = {
  symb : ['₽', '₴', '$'],
  name : ['Рубль', 'Гривна', 'Доллар']
};

// sync bonus state with background storage
setTimeout(() => {
  chrome.storage.sync.set({'NickNameBonus' : localStorage.getItem('keys-dota2-nicknamedisc')}, function() {});
}, 1000);
// Hardcoded html header
$( document ).ready(function() {

  // Inject script in DOM do make posible fetch local variables
  let injectFetcher = document.createElement('script');
  injectFetcher.src = chrome.extension.getURL('./fetchlocal.js');
  injectFetcher.onload = function () { this.remove() };
  (document.head || document.documentElement).appendChild(injectFetcher);

  // Inject price tag css, whatever it'll overlaps SIH's, but still work
  // and now we don't need check for SIH's css and inject it later, if it not installed
  let css = document.createElement('link');
  css.href = chrome.runtime.getURL('keys-dota2.css');
  css.rel = 'stylesheet';
  css.type = 'text/css';
  (document.head || document.documentElement).appendChild(css);

	chrome.storage.sync.get(['keys_dota2_currency', 'keys_dota2_discount', 'keys_dota2_enable', 'NickNameBonus'], function(res) {
    localStorage.setItem('keys_dota2_currency', res.keys_dota2_currency);
    localStorage.setItem('keys_dota2_discount', res.keys_dota2_discount);
    // hardcoded html info block
		if (res.keys_dota2_enable) {
			$(`<div class="trade_partner_header responsive_trade_offersection top"> <div class="trade_partner_headline nicknamebonus"> <span class="trade_partner_headline_sub"> </span>&nbsp; </div> <div class="trade_partner_info_block" style="background-color: rgba( 255, 255, 255, 0.25 );">
				 <img src="${chrome.extension.getURL('images/logo.png')}" style="width: 256px;"/>
				 </div> <div class="trade_partner_info_block" style="min-height: 100px;display: inline-grid;"> <div class="trade_partner_steam_level"> <div class="friendPlayerLevel lvl_0" style="margin-top: 5px;"><span class="friendPlayerLevelNum totaldiscount">%</span> </div> <div class="trade_partner_inline_hack"> <div class="trade_partner_steam_level_desc trade_partner_info_text" style="font-size: 17px"> Ваш бонус </div> </div> </div> <div class="trade_partner_steam_level">
				 <div class="friendPlayerLevel lvl_0" style="margin-top: 5px;"><span class="friendPlayerLevelNum">${CURR.symb[res.keys_dota2_currency || 0]}</span>
				 </div> <div class="trade_partner_inline_hack"> <div class="trade_partner_steam_level_desc trade_partner_info_text" style="font-size: 17px">
				 Валюта: ${CURR.name[res.keys_dota2_currency || 0]}</div>
				 </div> </div> </div> <div class="trade_partner_info_block" style="min-height: 100px;display: inline-grid;"> <div class="trade_partner_steam_level"> <center><div class="trade_partner_inline_hack"> <div class="trade_partner_steam_level_desc trade_partner_info_text keysdota2bot" style="font-size: 17px">Загрузка...</div> </div></center> </div> <div class="trade_partner_steam_level"> <center><div class="trade_partner_inline_hack">
         <div class="trade_partner_steam_level_desc trade_partner_info_text keysdota2bottype" style="font-size: 17px;">данных о профиле</div> </div></center> </div> </div> <div class="trade_partner_info_block" style="min-height: 100px;display: inline-grid;"> <div class="trade_partner_steam_level"> <center><div class="trade_partner_inline_hack"> <div class="trade_partner_steam_level_desc trade_partner_info_text keysdota2totaltitle" style="font-size: 17px">
         Можем заплатить:</div> </div></center> </div>
         <div class="trade_partner_steam_level"> <center><div class="trade_partner_inline_hack"> <div class="trade_partner_steam_level_desc trade_partner_info_text keysdota2total" style="font-size: 17px;">0</div> </div></center> </div>
         </div> <div style="clear: left"> </div> </div>`).insertAfter('.trade_partner_header')
		}
	});
});
