import * as firebase from "firebase/app";
import 'firebase/auth';
import { globalState, globalMutation } from "@/globalState"

let _auth: firebase.auth.Auth;

const isProduction = process.env.NODE_ENV == "production"

export const auth = {
    login() {
        if (!globalState.isLoggedIn) {
            if (!_auth) {
                if(!isProduction) globalState.isLoggedIn = true;
                return;
            }
            const provider = new firebase.auth.GoogleAuthProvider();
            // provider.addScope(
            //     "'https://www.googleapis.com/auth/contacts.readonly'"
            // );
            _auth.signInWithRedirect(provider);
        }
    },
    logout() {
        if (globalState.isLoggedIn) {
            if (!_auth) {
                if(!isProduction) globalState.isLoggedIn = false;
                return;
            }
            _auth.signOut().then(() => {
                globalState.isLoggedIn = false;
                globalMutation.updateUserName("");
            });
        }
    }
}

if (isProduction) {

    // https://firebase.google.com/docs/hosting/reserved-urls
    fetch("/__/firebase/init.json").then(async response => {
        firebase.initializeApp(await response.json());
        _auth = firebase.auth();
        _auth.useDeviceLanguage();

        _auth.onAuthStateChanged(user => {
            console.log("state changed", user);
            if (user) {
                globalState.isLoggedIn = true;
                globalMutation.updateUserName(user.displayName || "");
            } else {
                globalState.isLoggedIn = false
            }
            globalState.isAuthInit = true;
        });
        // _auth.getRedirectResult().then(res => {
        //     console.log("redirect", res.user)
        // });
        if (_auth.currentUser) {
            globalState.isLoggedIn = true;
            globalState.userName = _auth.currentUser.displayName || "";
            globalState.isAuthInit = true;
        }
        // if (!data.isLoggedIn) {
        //     const provider = new firebase.auth.GoogleAuthProvider();
        //     provider.addScope(
        //         "'https://www.googleapis.com/auth/contacts.readonly'"
        //     );
        //     auth.signInWithRedirect(provider);
        // }
    });
}