// src/stores/tomatoTimerStore.js
import { defineStore } from "pinia";

export const useTomatoTimerStore = defineStore("tomatoTimerStore", {
  state: () => ({
    tomatoTimerSetting: {
      singleFocusTime: 25,
      shortBreakTime: 5,
      cycleCount: 4, 
      openOSNotification: true,
      openSoundNotification: true,
      //是否已经开始计时
      isStart: false,
    },
    tomatoTimerStatus: {
      currentTurnTime: 0, //当前阶段剩余时间
      currentCycle: 1, //当前周期
      //当前计时器状态
      currentStatus: "stop", //start,stop,shortBreak,focus,pauseF
      lastStatus: "focus",// 暂停前的状态
    },
  }),
  actions: {
    setTomatoTimerSetting(tomatoTimerSetting) {
      this.tomatoTimerSetting = tomatoTimerSetting;
    },
  },
  getters: {
    getTotalTime(state) {
      return (
        state.tomatoTimerSetting.singleFocusTime *
          state.tomatoTimerSetting.cycleCount +
        state.tomatoTimerSetting.cycleCount *
          state.tomatoTimerSetting.shortBreakTime
      );
    },
    getTotalFocusTime(state) {
      return (
        state.tomatoTimerSetting.singleFocusTime *
        state.tomatoTimerSetting.cycleCount
      );
    },
    getFocusTimerByS(state){
      return state.tomatoTimerSetting.singleFocusTime * 60;
    },
    getBreakTimerByS(state){
      return state.tomatoTimerSetting.shortBreakTime * 60;
    },
    getDisplayTime(state){
      let hour = Math.floor(state.tomatoTimerStatus.currentTurnTime / 3600);
      let minute = Math.floor((state.tomatoTimerStatus.currentTurnTime - hour * 3600) / 60);
      let second = state.tomatoTimerStatus.currentTurnTime - hour * 3600 - minute * 60;
      return `${hour.toString().padStart(2, '0')} : ${minute.toString().padStart(2, '0')} : ${second.toString().padStart(2, '0')}`;
    }

  },
  persist: {
    key: "tomatoTimerStore", // 存储键名
    storage: window.localStorage, // 存储类型
  },
});
