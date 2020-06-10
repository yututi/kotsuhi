import Vue from "vue"


export type GlobalState = {
    isLoading: boolean;
    isLoggedIn: boolean;
    userName: string;
    isAuthInit: boolean;
}

export const globalState = Vue.observable<GlobalState>({
    isLoading: false,
    isLoggedIn: false,
    userName: "",
    isAuthInit: false
})

export const globalMutation = {
    updateUserName(userName: string) {
        if (globalState.userName != userName) {
            localStorage.setItem("userName", userName)
            globalState.userName = userName;
        }
    }
}