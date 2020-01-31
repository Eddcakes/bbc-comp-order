// .qa-match-block is the competition dom

chrome.runtime.sendMessage({ message: 'activate_icon' });
const favComp = ['ITALIAN COPPA ITALIA', 'FRENCH LIGUE 1'];

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    run();
    logRun();
  }
};

function run() {
  let matchBlock = document.querySelectorAll('.qa-match-block');
  let compParent = matchBlock[0].parentElement;

  //let currentComp = document.querySelectorAll('.sp-c-match-list-heading');
  let compArray = Array.from(matchBlock);

  let _ = favComp.map(fav => {
    return compArray.map((comp, index) => {
      if (comp.childNodes[0].innerText === fav) {
        compParent.prepend(comp);
      } else {
        compParent.append(comp);
      }
    });
  });
}

function logRun() {
  console.log('should have loaded');
}

//need to grab this from some sort of storage, and be able to edit from popup.js

/* let newOne = favouriteCompetitions.map(fav => {
  return currentCompetitions.forEach(comp => {
    comp.innerText === fav
      ? comp.closest('div')
      : rest.push(comp.closest('div'));
  });
}); */
