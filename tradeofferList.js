//add check button for each tradeoffer
if (!$J('.tradeoffer_footer_actions').length) $J('.tradeoffer_footer').html('<div class="tradeoffer_footer_actions"></div>')
$J('.tradeoffer_footer_actions').prepend('<a class="kd2offer_price whiteLink" style="cursor:pointer;">Получить цены keys-dota2.ru</a> | ');

//custom info
const CURRSYM = {
  symb : ['руб.', 'uah', 'usd'],
  name : ['Рубль', 'Гривна', 'Доллар']
};

const CURR = localStorage.getItem('keys_dota2_currency');
let DISCOUNT = localStorage.getItem('keys_dota2_discount');

if (DISCOUNT === 'undefined') DISCOUNT = 0;

const DOMAINS = JSON.parse(localStorage.getItem('keys-dota2-domains'));
let NickNameBonus = 0;

if (localStorage.getItem('keys-dota2-nicknamedisc') == 'true') NickNameBonus = 1;

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

$J('.kd2offer_price').click(function () {
    if ($J(this).is('.updated')) $J('.totalinoffer').remove();
    else {
      kd2GetAllPrice($J(this).parents('.tradeoffer'));
      $J(this).addClass('updated');
    }

    setTimeout(() => {updateEachTotal($J(this).parents('.tradeoffer'))}, 1000);
});

let getItemsP = (el, side) => {
  let total = 0;
  $J(el).find(`.${side} .t-price`).each(function (i, e) {
    total += parseFloat($J(this).html());
  });
  return total.toFixed(2);
}

let updateEachTotal = el => {
  // prerender ...maybe?
  $J(el).find('.tradeoffer_item_list .keysdota2rukey');
  setTimeout(() => {
  let elems = $J(el).find('.tradeoffer_item_list .keysdota2rukey');
  let keyscount = elems.length;

  elems.each(function (i, e) {$J(this).html($J(this).attr(`data-${keyscount > 100 ? 100 : (keyscount > 25 ? 25 : 'def')}price`))});

  let pprim = getItemsP(el, 'primary');
  let psec  = getItemsP(el, 'secondary');
    $J(el).find('.primary .tradeoffer_items_header').append(`<span class="totalinoffer" style="color: #10ff00;">(keys-dota2.ru: ${pprim} ${CURRSYM.symb[CURR]})</span>`)
    $J(el).find('.secondary .tradeoffer_items_header').append(`<span class="totalinoffer" style="color: #10ff00;">(keys-dota2.ru: ${psec} ${CURRSYM.symb[CURR]})</span>`)
  }, 200);
}

let kd2GetAllPrice = parent => {
    parent.find('.trade_item').each(function () {
        kd2PrebuildData(this, $J(this).attr('data-economy-item'));
    });
};

// god bless SIH for its functions
  let kd2PrebuildData = (ele, key, getprice) => {
    let kd2rgItemKey = key.split('/');
    if (kd2rgItemKey.length == 3 || kd2rgItemKey.length == 4) {
        ele.inited = true;
        let kd2strURL = null;
        let appid = kd2rgItemKey[0];

        if (appid == 'classinfo') {
            appid = kd2rgItemKey[1];
            let classid = kd2rgItemKey[2];
            let instanceid = (kd2rgItemKey.length > 3 ? kd2rgItemKey[3] : 0);
            kd2strURL = 'economy/itemclasshover/' + appid + '/' + classid + '/' + instanceid;
            kd2strURL += '?content_only=1&l=english';
        } else {
            let contextid = kd2rgItemKey[1];
            let assetid = kd2rgItemKey[2];
            let kd2strURL = 'economy/itemhover/' + appid + '/' + contextid + '/' + assetid;
            kd2strURL += '?content_only=1&omit_owner=1&l=english';
            if (kd2rgItemKey.length == 4 && kd2rgItemKey[3]) {
                let strOwner = kd2rgItemKey[3];
                if (strOwner.indexOf('id:') == 0) {
                    kd2strURL += '&o_url=' + strOwner.substr(3);
                } else {
                    kd2strURL += '&o=' + strOwner;
                }
            }
        }

        $J.ajax({
            url: window.location.protocol + "//steamcommunity.com/" + kd2strURL,
            cache: true,
            data: {l: 'english'}
        }).done(function (data) {
            var match = /BuildHover\( '(.*)', (.*)\);/i.exec(data);
            if (match !== null) {
                const pref = match[1];
                const item = JSON.parse(match[2]);
                let name = KD2PRICE[item.market_hash_name] || KD2PRICE[item.market_hash_name.slice(item.market_hash_name.indexOf(' ')+1)] || KD2PRICE[item.market_hash_name + '@1'] || KD2PRICE[item.market_hash_name + '@26'] || KD2PRICE[item.market_hash_name + '@101'];
                if (!item.name.toLowerCase().match(/auspicious/g)) {
                  if (name && (name[3] == '' || name[3] == '1')) {
                    let _price = it => {
                      price = parseFloat(it[CURR].replace(',','.'));
                      price = price + ((price/100)*parseFloat(parseFloat(DISCOUNT)+parseFloat(NickNameBonus)));
                      return price;
                    }
                    let toAppend = '<div class="t-price keysdota2ru ';
                    if (typeof KD2PRICE[item.name + '@26'] != 'undefined') {
                      toAppend += `keysdota2rukey" data-defprice ="${_price(name).toFixed(2)} ${CURRSYM.symb[CURR]}" `;
                      toAppend += `data-25price ="${_price(KD2PRICE[item.name + '@26']).toFixed(2)} ${CURRSYM.symb[CURR]}" `;
                      toAppend += `data-100price ="${_price(KD2PRICE[item.name + '@101']).toFixed(2)} ${CURRSYM.symb[CURR]}" `;
                    } else toAppend += '"';
                    toAppend += `data-price ="${parseFloat(_price(name)).toFixed(2)} ${CURRSYM.symb[CURR]}" title="keys-dota2.ru">${parseFloat(_price(name)).toFixed(2)} ${CURRSYM.symb[CURR]}</div>`;

                    $J(ele).append(toAppend);
                  }
                }
            }
        });
    } else {
        return null;
    }
};
