document.addEventListener('readystatechange', evt => {
  console.log(document.readyState);
  console.log('state changed');
  // not All as we want to get parent node anyway

  // observer seems to work when i enter the code into the console
  // why is it not working from the extension :(
  const list = document.querySelector('.qa-match-block').parentNode;

  const observer = new MutationObserver(mutations => {
    mutations.forEach(record => {
      console.log(record);
    });
  });
  console.log(list);
  observer.observe(list, {
    attributes: true,
    childList: true,
    subtree: true
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request, sender, sendResponse);
  if (request.args === 'pageUpdate') {
    console.log('page has been updated');
  }
  sendResponse({ response: 'pageUpdate received' });
});

chrome.storage.sync.get('compList', data => {
  //data is stored as an array
  console.log(data.compList);
  const favLeagues = data.compList;
  // now we can search the node list to try and reorder
});

// .qa-match-block is the competition dom
//mutation observers
