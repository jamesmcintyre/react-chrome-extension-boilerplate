
// save firabase user to local storage from firebase and save to local
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
        localStorage.setItem('currentUser', JSON.stringify(user));
        let userObject = localStorage.getItem('currentUser');
        resolve(JSON.parse(userObject));
    })
}

// save current user and than return it Proise this
export function currentUserPromise() {
    return new Promise((resolve, reject) => {
        let userObject = localStorage.getItem('currentUser');
        resolve(JSON.parse(userObject));
    });
}

// get current user without promise
export function currentUser(){
  return JSON.parse(localStorage.getItem('currentUser'));
}



// ----------- non-firebase related (from other boiler):

function saveState(state) {
  chrome.storage.local.set({ state: JSON.stringify(state) });
}

// todos unmarked count
function setBadge(todos) {
  if (chrome.browserAction) {
    const count = todos.filter((todo) => !todo.marked).length;
    chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
  }
}

export function storage() {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    store.subscribe(() => {
      const state = store.getState();
      saveState(state);
      setBadge(state.todos);
    });
    return store;
  };
}
