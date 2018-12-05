// update domains list everywhere
chrome.runtime.sendMessage(chrome.runtime.id, {method: 'domains'}, function (res) {
  let domains = res.feed.entry.map(e => e.title.$t);
  localStorage.setItem('keys-dota2-domains', JSON.stringify(domains));
});

let injectbonus = document.createElement('script');
// self executable function
injectbonus.text = `
  (() => {
    const DOMAINS = JSON.parse(localStorage.getItem('keys-dota2-domains'));
    let name = '';
    //trying get nickname from steam js
    if (typeof g_strYourPersonaName != 'undefined') name = g_strYourPersonaName;
    //trying get nickname from tag (ex. "NickName » Edit Profile")
    else if ($J('.profile_small_header_name > .whiteLink').html()) name = $J('.profile_small_header_name > .whiteLink').html();
    //trying get nickname from dropdown in header
    else if ($J($J('.username')[1]).html()) name = $J($J('.username')[1]).html();

    //if domain found - update bonus state and stop function
    for (domain of DOMAINS) {
      if (name.toLowerCase().indexOf(domain) > -1) {
        localStorage.setItem('keys-dota2-nicknamedisc', true);
        return true;
      }
    }
    localStorage.setItem('keys-dota2-nicknamedisc', false);
  })();
`;
injectbonus.onload = function () { this.remove() };
(document.head || document.documentElement).appendChild(injectbonus);

setTimeout(() => {
  chrome.storage.sync.set({'NickNameBonus' : localStorage.getItem('keys-dota2-nicknamedisc')}, function() {});
}, 500);
