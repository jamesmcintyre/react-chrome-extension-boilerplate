import 'firebase';
import {
    FIREBASE_CONFIG
} from './firebase_config';
import {
    currentUserPromise,
    fetchUserObject
} from './localstorage';

// You can remove it
if (FIREBASE_CONFIG.apiKey.length < 1) {
    alert("Please fill your Firebase settings to config.js ");
}

export const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();

// FIREBASE TOOL OBJECT LITERAL
var FireBaseTools = {

    getProvider: (provider) => {

        switch (provider) {
            case "facebook":
                return new firebase.auth.FacebookAuthProvider();
                break;
            case "google":
                return new firebase.auth.GoogleAuthProvider();
                break;
            default:

        }
    },
    // Login with provider => p is provider "facebook" or "google"
    loginWithProvider: (p) => {

        var provider = FireBaseTools.getProvider(p);
        return firebaseAuth.signInWithPopup(provider).then(function(result) {

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // save user to localstorage
            return fetchUserObject(user).then(user => {
                return user;
            })


        }).catch(function(error) {

            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;

            return {
                errorCode: error.code,
                errorMessage: error.message
            }

        });

    },

    loginWithProviderCredentials: () => {

      return new Promise((resolve, reject) => {

        chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
          if (chrome.runtime.lastError && !interactive) {
            console.log('It was not possible to get a token programmatically.');
            reject('It was not possible to get a token programmatically.');
            // Show the sign-in button
            // document.getElementById('quickstart-button').disabled = false;
          } else if(chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else if (token) {
            // Authrorize Firebase with the OAuth Access Token.
            var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            return firebaseAuth.signInWithCredential(credential)
              .then(function(){
                // console.log('from then of firebaseAuth.signInWithCredentials')
                // resolve()
                currentUserPromise().then(user => {
                    if (user) {
                        console.log('from inside w credentials to resolve user obj: ', user);
                        resolve(user)
                    }
                })
              }
              )
              .catch(function(error) {
                // The OAuth token might have been invalidated. Lets' remove it from cache.
                if (error.code === 'auth/invalid-credential') {
                  chrome.identity.removeCachedAuthToken({token: token}, function() {
                    loginWithProviderCredentials(interactive);
                  });
                }
                else{
                  return {
                    errorCode: error.code,
                    errorMessage: error.message
                  }
                }
              });
          } else {
            console.error('The OAuth Token was null');
            reject('The OAuth Token was null');
          }
        })
      });

    },


    registerUser: (user) => {

        return firebaseAuth.createUserWithEmailAndPassword(user.email, user.password).then(user => {

            return fetchUserObject(user).then(user => {
                return user;
            })

        }).catch(error => {

            return {
                errorCode: error.code,
                errorMessage: error.message
            }

        });

    },

    logoutUser: (user) => {

        return firebaseAuth.signOut().then(function() {
            // Sign-out successful and clear data.
            localStorage.clear();
            return {
                success: 1,
                message: "logout"
            };
        });
    },

    fetchUser: () => {

        return new Promise((resolve, reject) => {
            currentUserPromise().then(user => {
                if (user) {
                    console.log('from inside fetchUser to resolve user obj: ', user);
                    resolve(user)
                };
            });

            firebaseAuth.onAuthStateChanged(user => {
                //resolve(firebase.auth().currentUser);
                if (user) {
                    fetchUserObject(firebase.auth().currentUser).then(user => {
                        resolve(user);
                    })
                } else {
                    reject(user);
                }
            });
        });

    },

    loginUser: (user) => {

        return firebaseAuth.signInWithEmailAndPassword(user.email, user.password).then(user => {
            // save user to localstorage
            return fetchUserObject(user).then(user => {
                return user;
            })

        }).catch(error => {
            return {
                errorCode: error.code,
                errorMessage: error.message
            }

        });
    },

    updateUser: (u) => {

        if (firebaseAuth.currentUser) {
            var user = firebaseAuth.currentUser;
            return user.updateProfile({
                displayName: u.displayName,
                photoUrl: '' // field for photo url
            }).then(data => {

                // renew user
                return fetchUserObject(firebase.auth().currentUser).then(user => {
                    return user;
                })

            }, error => {
                return {
                    errorCode: error.code,
                    errorMessage: error.message
                }
            })
        } else {
            return null;
        }


    },

    resetPasswordEmail: (email) => {

        return firebaseAuth.sendPasswordResetEmail(email).then((data) => {
            return {
                message: 'Email sent',
                errorCode: null
            }
        }, error => {
            // An error happened.
            return {
                errorCode: error.code,
                errorMessage: error.message
            }
        });

    },

    changePassword: (newPassword) => {

        return firebaseAuth.currentUser.updatePassword(newPassword).then(() => {
            return fetchUserObject(user).then(user => {
                return user;
            })

        }, error => {

            return {
                errorCode: error.code,
                errorMessage: error.message
            }
        });

    }
};

// export FirebaseTolls
export default FireBaseTools;
