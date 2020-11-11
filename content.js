// maybe i don't even need to talk back to the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //talk back to background script

  /*
    elements on the page dont have static names and this may change at anypoint 
    if data-reactid is used multiple times 
  */
  const target = document.querySelector("div[data-reactid]");
  // might need to play here as list is likely to update with scores but we shouldnt need to reorder again
  const config = { attributes: false, childList: true, subtree: true }; //subtree seems to be necessary
  const observer = new MutationObserver(callback);
  observer.observe(target, config);
  //

  //observer.disconnect();
  if (request.args === "pageUpdate") {
    console.log("page has been updated");
  }
  sendResponse({ response: "pageUpdate received" });
});

function callback(mutationsList, observer) {
  let reorder = false;
  console.log(mutationsList);
  mutationsList.forEach((mutation) => {
    if (mutation.type === "childList") {
      console.log("A child node has been added or removed");
      // if any childList has changed then we are gnna reorder the fixture list
      reorder = true;
    }
  });

  /*
when moving to a page we havent been to
3 mutation events happen (the date is clicked the date buttons change)
next mutation event loding spinner is removed
node child list that is added is the entire block of all the fixtures
actually 2nd and 3rd seem to be the same mutation, removed spinner and added div containing match blocks

when moving back to a date we have already clicked on this page load
many observable events happen because it doesnt show the loading spinner
instead it removes all match blocks and adds match blocks that it prob had cached
*/

  if (reorder) {
    //check fixtures exist to reorder?
    let area = document.querySelectorAll(".qa-match-block");
    if (area.length > 0) {
      //reorder
      //console.log('reorder');
      //disconnect because we dont want to run again when we add our sorted list
      observer.disconnect();
      sortCompetitionList();
    }
  }
}

function sortCompetitionList() {
  chrome.storage.sync.get("compList", (data) => {
    const userComps = data.compList;
    if (userComps !== undefined) {
      //user comps is current users listed competitions
      let newNodeList = [];

      //instead of looping over the nodelist im gnna create array from it so then i can remove sections without fucking it
      let compsOnPage = document.querySelectorAll(".qa-match-block");

      const arrayOfCompsOnPage = Array.from(compsOnPage);
      userComps.forEach((userComp, index) => {
        const checkedComps = arrayOfCompsOnPage.filter((element) => {
          if (element.children[0].innerText.trim().toUpperCase() === userComp) {
            //finds competition block title
            newNodeList.push(element);
          } else {
            return element;
          }
        });
        newNodeList = [...newNodeList, ...checkedComps];
      });
      // console.log(newNodeList);
      const nodesToAdd = createNodeList(newNodeList);
      compsOnPage[0].parentElement.style.display = "none";
      console.log(nodesToAdd);
      //compsOnPage[0].parentElement.parentElement.appendChild(nodesToAdd);
    }
  });
}

function createNodeList(arrayOfElements) {
  let container = document.createDocumentFragment();
  arrayOfElements.forEach((element) => {
    container.appendChild(element.cloneNode());
  });
  return container;
}
