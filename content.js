// wait for msg from background
// port = chrome.extension.connect();
port = chrome.extension.connect();
port.onDisconnect.addListener(function(event) {
  // Happened immediately before adding the proper backend setup.
  // With proper backend setup, allows to determine the extension being disabled or unloaded.
  console.log('disconnect', event);
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request, sender, sendResponse);
  if (request.args === 'pageUpdate') {
    console.log('page has been updated');
    let compsLoading = true;
    let loadingDiv = document.querySelector(
      '.sp-c-football-scores-match-list-loading'
    ); //if already loaded this will be null

    // hacky to wait for the competitions div to exist
    // well this doesnt work if cached as loads to fast so never runs
    let itr = 0;
    while (compsLoading && loadingDiv !== null && itr < 20) {
      let firstComp = document.querySelector('.qa-match-block');
      if (firstComp) {
        compsLoading = false;
        sortList();
      }
      itr++;
      setTimeout(() => {}, 50);
    }
    if (loadingDiv === null) {
      sortList();
    }
  }
  sendResponse({ response: 'pageUpdate received' });
});

function sortList() {
  chrome.storage.sync.get('compList', data => {
    //data is stored as an array
    const favLeagues = data.compList;
    console.log(favLeagues);
    // now we can search the node list to try and reorder
    let list = document.querySelector('.qa-match-block').parentNode;
    const todaysComps = document.querySelectorAll('.qa-match-block');
    let compArray = [...todaysComps];
    //console.log(favLeagues, list);
    let userList = [];
    let remainder = [];
    let lastIndex = 0;
    for (let compIndex = 0; compIndex < todaysComps.length; compIndex++) {
      let added = false;
      for (let favIndex = 0; favIndex < favLeagues.length; favIndex++) {
        if (
          compArray[compIndex].children[0].innerText.trim() ===
          favLeagues[favIndex]
        ) {
          userList.splice(favIndex, 0, todaysComps[compIndex]);
          added = true;
          break;
        }
      }
      if (!added) {
        remainder.push(compArray[compIndex]);
      }
    }
    const newOrder = [...userList, ...remainder];
    console.log(userList, remainder);
    // console.log(newOrder);
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    newOrder.forEach(element => {
      list.appendChild(element);
    });
  });
}
