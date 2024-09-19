// src/stores/calendarStore.js
import { defineStore } from "pinia";
import { generateCalendarData } from "@/script/generateCalendarData";
import { useTodoListStore } from "./todoListStore";

export const useCalendarStore = defineStore("calendarStore", {
  state: () => ({
    setting: {
      year: 2024,
      month: 9,
      selectDay: {
        year: null,
        month: null,
        day: null,
        todoList: []
      },
    },
  }),
  actions: {
    addMonth() {
      this.setting.month += 1;
      if (this.setting.month > 12) {
        this.setting.month = 1;
        this.setting.year += 1;
      }
    },
    subMonth() {
      this.setting.month -= 1;
      if (this.setting.month < 1) {
        this.setting.month = 12;
        this.setting.year -= 1;
      }
    },
    setMonth(month) {
      this.setting.month = month;
    },
    setYear(year) {
      this.setting.year = year;
    },
    initSelectDay() {
      const date = new Date();
      this.setting.selectDay.year = date.getFullYear();
      this.setting.selectDay.month = date.getMonth() + 1;
      this.setting.selectDay.day = date.getDate();
    },
  },
  getters: {
    getData: (state) => {
      
      const todoListStore = useTodoListStore();
      const generateData = generateCalendarData(
        state.setting.year,
        state.setting.month - 1
      );
      const todoList = todoListStore.getToDoByYearMonth;
      console.log("todoList:", todoList);
      console.log("generateData:", generateData);
      todoList.forEach((item) => {
        // 从item中获取月份和日期
        const date = new Date(item.time);
        const month = date.getMonth();
        let day = date.getDate();
        // 获取month月的第一个周日
        // 获取month月的第一天
        const firstDayOfMonth = new Date(
          state.setting.year,
          state.setting.month - 1,
          1
        );

            // 上个月的最后一天
            const prevDate = new Date(firstDayOfMonth);
            prevDate.setDate(firstDayOfMonth.getDate() - 1);

            day = prevDate.getDay() + date.getDate();
            let weekIndex = Math.floor(day / 7);
            let dayIndex = day % 7;
            console.log('item:',item)
            console.log("preweekIndex:", weekIndex, "dayIndex:", dayIndex);
            generateData[weekIndex][dayIndex]["todoList"].push(item);
            generateData[weekIndex][dayIndex]["todoNum"]++
          /* }
        } */
      });

      return generateData;
    },
  },
  persist: {
    key: "calendarStore", // 存储键名
    storage: window.localStorage, // 存储类型
  },
});
