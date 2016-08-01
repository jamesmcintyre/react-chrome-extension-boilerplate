import firebase from './firebase';
import { currentUserPromise } from './localstorage';

function requireAuth(nextState, replace) {

    if (!currentUserPromise()) {
        replace({
            pathname: '/login',
            state: {
                nextPathname: nextState.location.pathname
            }
        })
    }
}

module.exports = requireAuth;
