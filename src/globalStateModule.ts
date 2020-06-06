import { Component, Vue } from "vue-property-decorator";

// reactive data.
@Component
class GrobalStateModule extends Vue {
    isLoading: boolean = false;
    userName: string = "";

    saveUserNameLocally() {
        localStorage.setItem("userName", this.userName)
    }
}

const module = new GrobalStateModule();

module.userName = localStorage.getItem("userName") || "";

export default module;