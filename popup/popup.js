window.onload = function() {
	chrome.storage.sync.get(['keys_dota2_currency', 'keys_dota2_discount', 'keys_dota2_enable', 'NickNameBonus'], function(res) {

		if (res.NickNameBonus == 'true') {
			document.getElementById('bonus').innerHTML = '✅ Бонус за никнейм активирован! (+1%)';
		} else {
			document.getElementById('bonus').innerHTML = '❌ Не активирован бонус за никнейм! (<a href="http://keys-dota2.ru/sell-items" target="_blank">Подробнее</a>)';
		}

		let hide = document.getElementById("enabled");

		let set = function(obj) { chrome.storage.sync.set(obj, function() {}) };

		document.getElementById('checkbox').onclick = function(){
			set({'keys_dota2_enable': hide.hidden});
			hide.hidden = !hide.hidden;
			fill();
		};

		let fill = function() {
			if (!!res.keys_dota2_currency && res.keys_dota2_currency >= 1 && res.keys_dota2_currency <= 3) document.getElementById('dropdown').value = res.keys_dota2_currency;
			if (!!res.keys_dota2_discount && res.keys_dota2_discount) document.getElementById('inputtext').value = res.NickNameBonus == 'true' ? res.keys_dota2_discount + 1 : res.keys_dota2_discount;
		}

		if (res.keys_dota2_enable) {

			document.getElementById('checkbox').click();

			fill()

		}
		document.getElementById('save').onclick = function(){
			let i_discount = parseInt(document.getElementById('inputtext').value);
			let i_currency = document.getElementById('dropdown').value;

			if (i_discount != 'undefined') set({'keys_dota2_discount': i_discount});
			if (i_currency) set({'keys_dota2_currency': i_currency});

			document.getElementById('savesucc').hidden = false;
		};
	});

};
