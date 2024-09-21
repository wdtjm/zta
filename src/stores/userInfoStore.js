// src/stores/userInfoStore.js
import { defineStore } from "pinia";

export const useUserInfoStore = defineStore("userInfoStore", {
  state: () => ({
    accountInfo:{
        account: "",
        password: "",
        loginStatus:false,
        isLoading:false,//登录中，负责登录页面显示loading动画
        role: '0', // 0: 本科生 3：研究生
        token: "",
        tokenExpireTime: "",
    },
    setting:{
      defaultPage:"/calendar",
      notShowCourseTable: false,
      updateTokenTimer: null,//定时器，用于更新研究生的token
    }
  }),
  actions: {
    setAccountInfo(payload) {
      this.accountInfo.account = payload.account || "";
      this.accountInfo.password = payload.password || "";
      this.accountInfo.loginStatus = payload.loginStatus || false;
      this.accountInfo.role = payload.role || '0';
      this.accountInfo.token = payload.token || "";
      this.accountInfo.tokenExpireTime = payload.tokenExpireTime || "";
    },
    logout(){
      this.accountInfo.account = "";
      this.accountInfo.password = "";
      this.accountInfo.loginStatus = false;
      this.accountInfo.role = '0';
      this.accountInfo.token = "";
      this.accountInfo.tokenExpireTime = "";
    }
  },
  persist: {
    key: "userInfoStore", // 存储键名
    storage: window.localStorage, // 存储类型
  },
});
