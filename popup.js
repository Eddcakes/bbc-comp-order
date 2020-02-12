/* 
if in popup.html script is added before dom elements we are trying to find
we would need to rap our code inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', ()=>{ content here });
*/

//sample data incase have to initialise chrome storage
// ['FRENCH LIGUE 1', 'ITALIAN COPPA ITALIA', 'CHAMPIONSHIP']

let textArea = document.querySelector('#compList');
let saveBtn = document.querySelector('#saveComp');
saveBtn.addEventListener('click', evt => saveList());

chrome.storage.sync.get('compList', data => {
  //data is stored as an array
  if (data !== undefined) {
    // console.log(data.compList);
    textArea.value = data.compList.join('\n');
  } else {
    textArea.value = '';
  }
});

function saveList() {
  let textArea = document.querySelector('#compList');
  let compArray = textArea.value.split('\n');
  console.log(compArray);
  chrome.storage.sync.set({ compList: compArray }, () => {
    console.log('added values');
  });
}

/* 
TODO: 
add user feedback when click 'save'
*/
