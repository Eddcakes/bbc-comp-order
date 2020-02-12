chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request, sender, sendResponse);

  if (request.args === 'pageUpdate') {
    console.log('page has been updated');
    let loaded = false; //helper for rejecting promise
    let compsPromise = new Promise((resolve, reject) => {
      //we do not have any 'ready'/'onLoad' functions available so have to check until loaded
      let loadedInterval = setInterval(() => {
        let competitions = document.querySelectorAll('.qa-match-block');
        if (competitions.length > 0) {
          //clear the interval we don't need to loop anymore
          clearInterval(loadedInterval);
          loaded = true;
          //[...competitions] do we want an array or just use the node list
          return resolve(competitions);
        }
      }, 10);
      setTimeout(() => {
        if (!loaded) {
          return reject('Waiting for competitions to load timeout');
        }
      }, 5000); //5000 timeout seem to work quite well for 'slow 3g' chrome dev tools
    });
    /*
    If we check the pages to fast we seem to get stuck in a request somewhere and it breaks the BBC component
    how can i avoid this? -> maybe the issue is that im manipulating the nodelist i supose i could remove and rebuild each time
    */
    compsPromise.then(compsOnPage => {
      //res is our competition node list
      //console.log(compsOnPage);
      chrome.storage.sync.get('compList', data => {
        const userComps = data.compList;
        if (userComps === undefined) {
          console.log('User has not added any competitions to the popup');
        } else {
          // console.log(userComps.reverse()); //reversing favlist so i can prepend to the nodelist and get the correct order
          userComps.forEach((userComp, index) => {
            //no way to brek from .forEach could use normal loop..?
            compsOnPage.forEach(element => {
              //do i need toUpper() to be safe?
              if (element.children[0].innerText.trim() === userComp) {
                // console.log(compsOnPage[0], element);

                // If parent == element errors out because cant move itself before itself so avoid this
                if (compsOnPage[0] !== element) {
                  compsOnPage[0].prepend(element);
                }
              }
            });
          });
        }
      });
    });
    compsPromise.catch(err => {
      console.log(err);
    });
  }

  //talk back to background script
  sendResponse({ response: 'pageUpdate received' });
});

/* //if already loaded this will be null
    let loadingDiv = document.querySelector(
      '.sp-c-football-scores-match-list-loading'
    );  */
