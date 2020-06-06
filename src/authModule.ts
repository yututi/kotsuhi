import { Component, Vue } from "vue-property-decorator";
import * as firebase from "firebase/app";
import 'firebase/auth';
import global from "@/globalStateModule"

let auth: firebase.auth.Auth;
// reactive data.
@Component
class AuthModule extends Vue {
    isLoggedIn: boolean = false;
    userName: string = "";
    isInit: boolean = false;
    login() {
        if (!this.isLoggedIn && this.isInit) {
            if (!auth) {
                this.isLoggedIn = true;
                return;
            }
            const provider = new firebase.auth.GoogleAuthProvider();
            // provider.addScope(
            //     "'https://www.googleapis.com/auth/contacts.readonly'"
            // );
            auth.signInWithRedirect(provider);
        }
    }
    logout() {
        if (this.isLoggedIn && this.isInit) {
            if (!auth) {
                this.isLoggedIn = false;
                return;
            }
            auth.signOut().then(() => {
                this.isLoggedIn = false;
                this.userName = "";
            });
        }
    }
}

const data = new AuthModule();

if (process.env.NODE_ENV == "production") {

    global.isLoading = true;
    // https://firebase.google.com/docs/hosting/reserved-urls
    fetch("/__/firebase/init.json").then(async response => {
        firebase.initializeApp(await response.json());
        auth = firebase.auth();
        auth.useDeviceLanguage();

        auth.onAuthStateChanged(user => {
            console.log("state changed", user);
            if (user) {
                data.isLoggedIn = true;
                global.userName = data.userName = user.displayName || "";
            } else {
                data.isLoggedIn = false;
                data.userName = ""
            }
            global.isLoading = false;
        });
        auth.getRedirectResult().then(res => {
            console.log("redirect", res.user)
        });
        if (auth.currentUser) {
            data.isLoggedIn = true;
            global.userName = data.userName = auth.currentUser.displayName || "";
            global.isLoading = false;
        }
        data.isInit = true;
        // if (!data.isLoggedIn) {
        //     const provider = new firebase.auth.GoogleAuthProvider();
        //     provider.addScope(
        //         "'https://www.googleapis.com/auth/contacts.readonly'"
        //     );
        //     auth.signInWithRedirect(provider);
        // }
    });
} else {
    data.isInit = true;
    global.isLoading = false;
}


export default data;