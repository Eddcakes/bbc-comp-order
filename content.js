// maybe i don't even need to talk back to the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //talk back to background script

  /*
    elements on the page dont have static names and this may change at anypoint 
    if data-reactid is used multiple times 
  */
  const target = document.querySelector('div[data-reactid]');
  // might need to play here as list is likely to update with scores but we shouldnt need to reorder again
  const config = { attributes: false, childList: true, subtree: true }; //subtree seems to be necessary
  const observer = new MutationObserver(callback);
  observer.observe(target, config);
  //

  //observer.disconnect();
  if (request.args === 'pageUpdate') {
    console.log('page has been updated');
  }
  sendResponse({ response: 'pageUpdate received' });
});

function callback(mutationsList, observer) {
  let reorder = false;
  mutationsList.forEach((mutation) => {
    if (mutation.type === 'childList') {
      console.log('A child node has been added or removed');
      // if any childList has changed then we are gnna reorder the fixture list
      reorder = true;
    }
  });
  if (reorder) {
    //check fixtures exist to reorder?
    let area = document.querySelectorAll(
      '.qa-match-block:not([data-sorted="sorted"])'
    );
    if (area.length > 0) {
      //reorder
      //console.log('reorder');
      sortCompetitionList();
    }
  }
}

function sortCompetitionList() {
  chrome.storage.sync.get('compList', (data) => {
    const userComps = data.compList;
    if (userComps !== undefined) {
      //user comps is current users listed competitions
      let compsOnPage = document.querySelectorAll('.qa-match-block');
      userComps.forEach((userComp, index) => {
        compsOnPage.forEach((element) => {
          element.dataset.sorted = 'sorted';
          if (element.children[0].innerText.trim().toUpperCase() === userComp) {
            if (compsOnPage[0] !== element) {
              compsOnPage[0].prepend(element);
            }
          }
        });
      });
    }
  });
}
