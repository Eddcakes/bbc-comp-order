// maybe i don't even need to talk back to the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //talk back to background script
  const target = findCompsOnPage();
  // might need to play here as list is likely to update with scores but we shouldnt need to reorder again
  const config = { attributes: false, childList: true }; //subtree seems to be necessary
  const observer = new MutationObserver(callback);
  observer.observe(target, config);
  if (request.args === "pageUpdate") {
    console.log("page has been updated");
  }
  sendResponse({ response: "pageUpdate received" });
});

function callback(mutationsList, observer) {
  let reorder = false;
  // only listening to childList changes anyway so dont need to check individual
  if (mutationsList.length > 0) {
    reorder = true;
  }
  // find and remove if we have already added a custom list before adding the next
  cleanUpCustomList();
  if (reorder) {
    //i'm not sure where the right place to disconnect should be
    observer.disconnect();
    let area = getCompsOnPage();
    if (area.length > 0) {
      sortCompetitionList();
    }
  }
}

function sortCompetitionList() {
  chrome.storage.sync.get("compList", (data) => {
    const userComps = data.compList;
    if (userComps !== undefined) {
      let newNodeList = [];
      //instead of looping over the nodelist im gnna create array from it so then i can remove sections
      let compsOnPage = getCompsOnPage();
      const arrayOfCompsOnPage = Array.from(compsOnPage);
      userComps.forEach((userComp, index) => {
        const checkedComps = arrayOfCompsOnPage.filter((element, index) => {
          if (element.children[0].innerText.trim().toUpperCase() === userComp) {
            //finds competition block title
            newNodeList.push(element);
          } else {
            return element;
          }
        });
        newNodeList = [...newNodeList, ...checkedComps];
      });
      const nodesToAdd = createNodeList(newNodeList);
      // just hide original list, it seems react on the page needs it to be left alone
      compsOnPage[0].parentElement.style.display = "none";
      // add our custom list
      compsOnPage[0].parentElement.parentElement.parentElement.appendChild(
        nodesToAdd
      );
    }
  });
}

function createNodeList(arrayOfElements) {
  let fragment = document.createDocumentFragment();
  let container = document.createElement("div");
  container.setAttribute("class", "reorderedList");
  arrayOfElements.forEach((element) => {
    container.appendChild(element.cloneNode(true));
  });
  fragment.appendChild(container);
  return fragment;
}

// helper function to remove out created list
function cleanUpCustomList() {
  let pruneDom = document.querySelectorAll(".reorderedList");
  if (pruneDom.length > 0) {
    pruneDom.forEach((eleToRemove) => {
      eleToRemove.parentNode.removeChild(eleToRemove);
    });
  }
}

function getCompsOnPage() {
  return document.querySelectorAll(".qa-match-block");
}

function findCompsOnPage() {
  /*
    elements on the page dont have static names and this may change at anypoint 
    if data-reactid is used multiple times 
  */
  return document
    .querySelector("div[data-reactid]")
    .lastElementChild.firstElementChild.firstElementChild.querySelector(
      "[role]"
    ).firstElementChild;
}
