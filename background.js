let url = {
  'prices' : 'https://spreadsheets.google.com/feeds/list/1n-LZfQI2kKy1m1BnuDteIrkPzcNKxpfXHPG3JjZB7F4/od6/public/values?alt=json',
  'bots'   : 'https://spreadsheets.google.com/feeds/list/1n-LZfQI2kKy1m1BnuDteIrkPzcNKxpfXHPG3JjZB7F4/ogrtrc2/public/values?alt=json',
  'domains'   : 'https://spreadsheets.google.com/feeds/list/1n-LZfQI2kKy1m1BnuDteIrkPzcNKxpfXHPG3JjZB7F4/o7t7j2j/public/values?alt=json'
}

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    $.ajax({
      url: url[request.method],
      type: 'GET',
      success: function(data) {
        console.log(data);
        callback(data);
      }
    });
    return true;
});
