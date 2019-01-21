const CURRSYM = {
  symb : ['руб.', 'uah', 'usd'],
  name : ['Рубль', 'Гривна', 'Доллар']
};

const CURR = localStorage.getItem('keys_dota2_currency');
let DISCOUNT = localStorage.getItem('keys_dota2_discount');
if (DISCOUNT === 'undefined') DISCOUNT = 0;

const BOTS = JSON.parse(localStorage.getItem('keys-dota2-bots'));
const DOMAINS = JSON.parse(localStorage.getItem('keys-dota2-domains'));

let NickNameBonus = 0;
if (localStorage.getItem('keys-dota2-nicknamedisc') == 'true') {
  NickNameBonus = 1;
  $J('.nicknamebonus').html('✅ Бонус за никнейм активирован! (+1%)');
} else $J('.nicknamebonus').html('❌ Не активирован бонус за никнейм! (<a href="http://keys-dota2.ru/sell-items" target="_blank">Подробнее</a>)');

$J('.totaldiscount').html(`${parseFloat(parseFloat(DISCOUNT)+parseFloat(NickNameBonus))}%`);

$J( document ).ready(function() {
  setTimeout (()=> {
    // also modded functions to count total
    _moveINV = MoveItemToInventory;
    _moveTR  = MoveItemToTrade;

    MoveItemToInventory = function (elItem) {
      _moveINV(elItem);
      updateTotal();
    }

    MoveItemToTrade = function (elItem) {
      _moveTR(elItem);
      updateTotal();
    }
    if (Object.keys(BOTS).includes(g_ulTradePartnerSteamID)) {
      $J('.keysdota2bot').html('Данный бот скупает:');
      $J('.keysdota2bottype').html(BOTS[g_ulTradePartnerSteamID]);
    } else {
      $J('.keysdota2bot').html('⚠️⚠️⚠️ Внимание ⚠️⚠️⚠️');
      $J('.keysdota2bottype').html('Это не аккаунт keys-dota2.ru');
    }
  }, 350);
});


// clear an array and fill with useful data
const _KD2PRICE = JSON.parse(localStorage.getItem('keys-dota2-prices'));
const KD2PRICE = {};
for (item of _KD2PRICE) {
  let _ = `${item.gsx$предмет.$t}@${item.gsx$count.$t}`
	KD2PRICE[item.gsx$count.$t != '' ? _ : item.gsx$предмет.$t] = [
    item.gsx$rub.$t,
    item.gsx$uah.$t,
    item.gsx$usd.$t,
    item.gsx$count.$t,
    _
  ];
}

let updateCurrItemsData = () => {
  let data = [];
  let _itm = g_ActiveInventory.rgInventory;
  for (item in _itm) {
    let obj = {
      'id'   : _itm[item].id,
      'name' : _itm[item].market_hash_name,
      'tags' : _itm[item].tags
    };
    data.push(obj);
  }
  return data;
}


let updateTotal = () => {
  let total = 0;
  let elems = $J('#trade_yours .p-price .price_flag.keysdota2rukey');
  let keyscount = elems.length;

  elems.each(function (i, e) {$J(this).attr('data-price', $J(this).attr(`data-${keyscount > 100 ? 100 : (keyscount > 25 ? 25 : 'def')}price`))});

  setTimeout(()=> {
    $J('#trade_yours .p-price .price_flag.keysdota2ru').each(function (i, e) {
      total += parseFloat($J(this).attr( 'data-price' ));
    });
    $J('.keysdota2total').html(`${total.toFixed(2)} ${CURRSYM.symb[CURR]}`);
  }, 100);
}

// Bit rewrited Steam's function, also must loads after SIH and works fine
// with its rewrited function
TradePageSelectInventoryMod = TradePageSelectInventory;
TradePageSelectInventory = function (user, appid, contextid, bLoadCompleted) {
  TradePageSelectInventoryMod(user, appid, contextid, bLoadCompleted);
  data = updateCurrItemsData();
  // Steam need some time to load this function and
  // also we can wait a bit more to prevent SIH break
  setTimeout(() => {
    let itemPart = `item${appid}_${contextid}`;
    for (item of data) {
      // don't even ask wtf is that, just hardcoded shit.
      if (!item.name.toLowerCase().match(/auspicious/g)) {
        let name = KD2PRICE[item.name] || KD2PRICE[item.name.slice(item.name.indexOf(' ')+1)] || KD2PRICE[item.name + '@1'] || KD2PRICE[item.name + '@26'] || KD2PRICE[item.name + '@101'];
        if (name && (name[3] == '' || name[3] == '1')) {
          let _price = it => {
            price = parseFloat(it[CURR].replace(',','.'));
            price = price + ((price/100)*parseFloat(parseFloat(DISCOUNT)+parseFloat(NickNameBonus)));
            return price;
          }
          let toAppend = '<div class="price_flag keysdota2ru ';
          if (typeof KD2PRICE[item.name + '@26'] != 'undefined') {
            toAppend += `keysdota2rukey" data-defprice ="${_price(name).toFixed(2)} ${CURRSYM.symb[CURR]}" `;
            toAppend += `data-25price ="${_price(KD2PRICE[item.name + '@26']).toFixed(2)} ${CURRSYM.symb[CURR]}" `;
            toAppend += `data-100price ="${_price(KD2PRICE[item.name + '@101']).toFixed(2)} ${CURRSYM.symb[CURR]}" `;
          } else toAppend += '"';
          toAppend += `data-price ="${parseFloat(_price(name)).toFixed(2)} ${CURRSYM.symb[CURR]}" title="keys-dota2.ru"></div>`;
          if (!$J(`#${itemPart}_${item.id} > .p-price`).length) $J(`#${itemPart}_${item.id}`).append('<div class="p-price"></div>');
          $J(`#${itemPart}_${item.id} > .p-price`).append(toAppend);
        }
      }
    }
  }, 150);
}
