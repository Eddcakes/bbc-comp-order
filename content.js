// wait for msg from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request, sender, sendResponse);
  if (request.args === 'pageUpdate') {
    console.log('page has been updated');
    sortList();
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
    let todayFav = [];
    let remainder = [];
    for (let compIndex = 0; compIndex < todaysComps.length; compIndex++) {
      let added = false;
      for (let favIndex = 0; favIndex < favLeagues.length; favIndex++) {
        if (
          compArray[compIndex].children[0].innerText.trim() ===
          favLeagues[favIndex]
        ) {
          todayFav.push(compArray[compIndex]);
          added = true;
          break;
        }
      }
      if (!added) {
        remainder.push(compArray[compIndex]);
      }
    }
    const newOrder = [...todayFav, ...remainder];
    // console.log(todayFav, remainder);
    // console.log(newOrder);
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    newOrder.forEach(element => {
      list.appendChild(element);
    });
  });
}
