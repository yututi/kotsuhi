<template>
  <div class="k-username">
    <template v-if="!isLoading">
    <input
      v-if="!isLoggedIn"
      placeholder="ゲストユーザ"
      class="k-username__txt"
      type="text"
      maxlength="30"
      v-model="userName"
      @blur="saveUserNameLocally"
    />
    <input v-else type="text" :value="authName" class="k-username__txt" disabled />
    <app-btn v-if="!isLoggedIn" :icon="['fa', 'sign-in-alt']" label="ログイン" round @click="login"></app-btn>
    <!-- <app-btn v-if="isLoggedIn" label="保存" icon="upload" round tooltip="未実装" @click="login"></app-btn>
    <app-btn v-if="isLoggedIn" label="更新" icon="download" round tooltip="未実装" @click="login"></app-btn>-->
    <app-btn v-if="isLoggedIn" label="ログアウト" icon="sign-out-alt" round @click="logout"></app-btn>
    </template>
    <template v-else>
      <app-circular :strokeWidth="12" style="width: 24px; height:24px;" color="white"/>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AppField from "@/components/Field.vue";
import AppPopover from "@/components/Popover.vue";
import AppBtn from "@/components/Btn.vue";
import AppCircular from "@/components/Circular.vue";
import { globalState, globalMutation } from "@/globalState";

@Component({
  components: {
    AppField,
    AppPopover,
    AppBtn,
    AppCircular
  }
})
export default class UserInfo extends Vue {
  userName = "";

  get isLoading() {
    return !globalState.isAuthInit;
  }

  get isLoggedIn() {
    return globalState.isLoggedIn;
    // return true;
  }

  get authName() {
    return globalState.userName;
  }

  _login?: Function;
  _logout?: Function;
  login() {
    if (this._login) this._login();
  }
  logout() {
    if (this._logout) this._logout();
  }

  saveUserNameLocally() {
    globalMutation.updateUserName(this.userName);
  }

  async mounted() {
    this.userName = globalState.userName;
    const { auth } = await import("@/firebaseModule");
    this._login = auth.login; 
  }
}
</script>
<style lang="scss">
.k-username {
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: 32px;
  &__txt {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    width: 150px;
    height: 32px;
    border: 1px solid transparent;
    border-radius: 9999px;
    padding: 0px 10px;
    outline: none;
    flex: 1;
    transition: background-color 0.2s;
    &:focus {
      background-color: white;
      color: black;
    }
    &::placeholder {
      color: white;
    }
  }

  & > *:not(:first-child) {
    margin-left: 5px;
  }
}
.k-login-providers {
  background-color: rgba(255, 255, 255, 0.2);
  color: dimgray;
  border: 1px solid gainsboro;
  border-radius: 3px;
  overflow: hidden;
  padding: 5px;
  width: 300px;
  &:focus {
    background-color: white;
  }
}
</style>