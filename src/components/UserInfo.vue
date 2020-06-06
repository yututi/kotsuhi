<template>
  <div class="k-username">
    <input
      v-if="!isLoggedIn"
      placeholder="ゲストユーザ"
      class="k-username__txt"
      type="text"
      maxlength="30"
      v-model="userName"
      @blur="saveUserNameLocally"
    />
    <input v-else type="text" :value="authName" class="k-username__txt" disabled>
    <app-btn v-if="!isLoggedIn" :icon="['fa', 'sign-in-alt']" label="ログイン" round @click="login"></app-btn>
    <!-- <app-btn v-if="isLoggedIn" label="保存" icon="upload" round tooltip="未実装" @click="login"></app-btn>
    <app-btn v-if="isLoggedIn" label="更新" icon="download" round tooltip="未実装" @click="login"></app-btn>-->
    <app-btn v-if="isLoggedIn" label="ログアウト" icon="sign-out-alt" round @click="logout"></app-btn>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AppField from "@/components/Field.vue";
import AppPopover from "@/components/Popover.vue";
import AppBtn from "@/components/Btn.vue";
import auth from "@/authModule";
import globalState from "@/globalStateModule";

@Component({
  components: {
    AppField,
    AppPopover,
    AppBtn
  }
})
export default class UserInfo extends Vue {
  userName = "";

  get isLoggedIn() {
    return auth.isLoggedIn;
    // return true;
  }

  get authName() {
    return auth.userName
  }

  login() {
    auth.login();
  }
  logout() {
    auth.logout();
  }

  saveUserNameLocally() {
    globalState.userName = this.userName;
    globalState.saveUserNameLocally();
  }

  mounted() {
    this.userName = globalState.userName;
  }
}
</script>
<style lang="scss">
.k-username {
  display: inline-flex;
  align-items: center;
  width: 100%;
  &__txt {
    width: 120px;
    height: 32px;
    border: 1px solid transparent;
    border-radius: 9999px;
    padding: 0px 10px;
    outline: none;
    flex: 1;
    &:disabled,
    &:disabled::placeholder {
      color: white;
    }
  }

  & > *:not(:first-child) {
    margin-left: 5px;
  }
}
.k-login-providers {
  background-color: white;
  color: dimgray;
  border: 1px solid gainsboro;
  border-radius: 3px;
  overflow: hidden;
  padding: 5px;
  width: 300px;
}
</style>