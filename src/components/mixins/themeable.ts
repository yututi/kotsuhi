import { Component, Vue, Prop } from "vue-property-decorator";


@Component
export default class Colorable extends Vue {
    @Prop({ type: String, default: "primary" })
    theme?: string;

    get themeClasses() {
        return {
            [`k-theme--${this.theme}`]: true
        }
    }
}