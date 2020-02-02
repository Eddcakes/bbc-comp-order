chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // console.log(tabId, changeInfo, tab);
    if (changeInfo.status === 'complete') {
      //send something to content script
      chrome.tabs.sendMessage(tab.id, { args: 'pageUpdate' }, () => {
        console.log('sent pageUpdate');
      });
    }
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'www.bbc.co.uk'
            }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
