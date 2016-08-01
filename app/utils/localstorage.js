
// save FIREbase user to local storage from firebase and save to local
export function fetchUserObject(obj) {

    return new Promise((resolve, reject) => {

        let user = {
            'email': obj.email,
            'uid': obj.uid,
            'u': obj.u,
            'displayName': obj.displayName,
            'refreshToken': obj.refreshToken,
            'emailVerified': obj.emailVerified,
            'isAnonymous': obj.isAnonymous,
            'photoUrl': obj.photoUrl
        };
        // let jsonUserObj = JSON.stringify(user);
        chrome.storage.local.set({currentUser: user}, function(result){
          console.log('localstorage set currentUser: ', result);
          chrome.storage.local.get('currentUser', function(result){
            console.log('localstorage get currentUser: ', result);
            if(result.currentUser){
              resolve(result.currentUser);
            } else {
              reject(result);
            }
          });
        });

    })
}

//extending as promise p1

// function setCurrentUser(userObj) {
// var setCurrentUser = new Promise ((resolve, reject) => {
//     chrome.storage.local.set({currentUser: userObj}, function(result){
//       console.log('localstorage set currentUser: ', result);
//     });
//   })
// }

// function getCurrentUser() {
//   return new Promise ((resolve, reject) => {
//     chrome.storage.local.get('currentUser', function(result){
//       console.log('localstorage get currentUser: ', result);
//     });
//   })
// }





// save current user and than return it Proise this
export function currentUserPromise() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('currentUser', function(result){
          console.log('currentUserPromise result: ', result);
          resolve(result.currentUser);
        });
    });
}

// get current user without promise
export function currentUser(){
  return chrome.storage.local.get('currentUser', function(){
  });
}



// ----------- non-firebase related (from other boiler):

// function saveState(state) {
//   chrome.storage.local.set('state', JSON.stringify(state));
// }
//
// // todos unmarked count
// function setBadge(todos) {
//   if (chrome.browserAction) {
//     const count = todos.filter((todo) => !todo.marked).length;
//     chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
//   }
// }
//
// export function storage() {
//   return next => (reducer, initialState) => {
//     const store = next(reducer, initialState);
//     store.subscribe(() => {
//       const state = store.getState();
//       saveState(state);
//       setBadge(state.todos);
//     });
//     return store;
//   };
// }
