//when the popup text area is updated we want to make sure the content is updated
// chrome.pageAction.getPopup;

// chrome.storage.sync.get();

// document.querySelector('#saveComp').addEventListener('click', );

let saveBtn = document.getElementById('saveComp');

console.log(saveBtn);

/* .addEventListener(
  'click',
  function() {
    console.log('bork');
  },
  false
); */

function saveComps(evt) {
  let userItems = document.querySelector('#compList');
  console.log('userItems');
  //chrome.storage.sync.set()
}
