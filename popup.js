let textArea = document.querySelector('#compList');

/*  chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
}); */

function saveComps() {
  let userItems = document.querySelector('#compList');
  console.log(userItems.value);
  chrome.storage.sync.set({ competitions: userItems.value }, () => {
    console.log('set value to: ' + competitions.value);
  });
  //chrome.storage.sync.set()
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get('userItems', result => {
    console.log(result);
    textArea.value = result.competitions;
  });
  let saveBtn = document.getElementById('saveComp');
  console.log(saveBtn);
  saveBtn.addEventListener('click', () => saveComps());
});
