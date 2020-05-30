import { Component, Vue } from "vue-property-decorator"

@Component
export default class MobileCompatible extends Vue {
    _isMobile!: boolean;
    get isMobile() {
        if (this._isMobile === undefined) {
            this._isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        }
        return this._isMobile;
    }
}