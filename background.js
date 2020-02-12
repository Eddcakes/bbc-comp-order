chrome.runtime.onInstalled.addListener(function() {
  // I seem to have to connect to the port for the backend to connect to content.js
  chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
      // May be empty.
    });
  });
  //^ should we use chrome.tabs.query instead to open the port?
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // console.log(tabId, changeInfo, tab);
    if (changeInfo.status === 'complete') {
      //send something to content script
      chrome.tabs.sendMessage(tab.id, { args: 'pageUpdate' }, () => {
        console.log('sent pageUpdate');
      });
    }
  });
  //needed for popup to show on this page
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
