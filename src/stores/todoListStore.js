// src/stores/todoListStore.js
import { defineStore } from "pinia";
import { useCalendarStore } from "./calendarStore";

export const useTodoListStore = defineStore("todoListStore", {
  state: () => ({
    lastUpdateTime: "",
    nextId: 6,
    todoList: [
      {
        id: 1, // 添加 id 属性
        time: "2022-01-01 12:00:00",
        content: "吃饭",
        isDone: false,
        location: "公司",
        isXZZD: false,
        isActive: false,
      },
      {
        id: 2, // 添加 id 属性
        time: "2022-01-01 13:00:00",
        content: "睡觉",
        isDone: false,
        location: "公司",
        isXZZD: false,
        isActive: false,
      },
      {
        id: 3, // 添加 id 属性
        time: "2022-01-01 14:00:00",
        content: "打豆豆",
        isDone: false,
        location: "公司",
        isXZZD: false,
        isActive: false,
      },
      {
        id: 4, // 添加 id 属性
        time: "2022-01-01 15:00:00",
        content: "写代码",
        isDone: false,
        location: "公司",
        isXZZD: false,
        isActive: false,
      },
      {
        id: 5, // 添加 id 属性
        time: "2022-01-01 16:00:00",
        content: "看书",
        isDone: false,
        location: "公司",
        isXZZD: false,
        isActive: false,
      },
    ],
    briefTodoList: [
      {
        id: 1, // 添加 id 属性
        content: "吃饭",
      },
    ],
    setting: {
      updateOnLoad: true,
      isLoading: false,
      defaultYear: 2024,
      showPrompt: true,// 是否显示格式提示
      urlLink: "", // 待办事项链接
      openUrlLink: false, // 是否打开待办事项链接
      addXZZDToUrl: true, // 待办链接中是否加入学在浙大待办
      isGetUrlLoading: false, // 是否正在获取待办事项链接
    },
  }),
  actions: {
    // 添加待办事项
    addTodo(todo) {
      this.todoList.push({
        id: this.nextId, // 为新增的待办事项添加 id 属性
        time: todo.time,
        course: todo.course || "",
        type: todo.type || "",
        content: todo.content,
        isDone: todo.isDone || false,
        location: todo.location || "not set",
        isXZZD: todo.isXZZD || false,
        xzzdId: todo.xzzdId || "",
        isActive: todo.isActive || false,
        isBrief: todo.isBrief || false,
      });
      this.nextId++; // 自增 id 属性
    },
    // 更新待办事项
    updateTodoStatus(id) {
      const index = this.todoList.findIndex((todo) => todo.id === id);
      this.todoList[index].isDone = !this.todoList[index].isDone;
    },
    toggleActive(id) {
      const index = this.todoList.findIndex((todo) => todo.id === id);
      this.todoList[index].isActive = !this.todoList[index].isActive;
    },
    // 删除待办事项
    deleteTodoById(id) {
      const index = this.todoList.findIndex((todo) => todo.id === id);
      this.todoList.splice(index, 1);
    },
    editTodo(id, todo) {
      const index = this.todoList.findIndex((item) => item.id === id);
      this.todoList[index] = {
        id: id,
        time: todo.time,
        course: todo.course || "",
        type: todo.type || "",
        content: todo.content,
        isDone: todo.isDone || false,
        location: todo.location || "not set",
        isXZZD: todo.isXZZD || false,
        xzzdId: todo.xzzdId || "",
        isActive: todo.isActive || false,
      };
    },
    clearAllCompeletedTodoList() {
      this.todoList.forEach((todo) => {
        if (todo.isDone) {
          this.deleteTodoById(todo.id);
        }
      });
    },
  },
  getters: {

    getTodoById(state, id) {
      return state.todoList.find((todo) => todo.id === id);
    },
    incompeleteTodoList: (state) => {
      return state.todoList
        .filter((todo) => !todo.isDone)
        .sort((a, b) => new Date(a.time) - new Date(b.time));
    },
    compeletedTodoList: (state) => {
      return state.todoList.filter((todo) => todo.isDone);
    },
    incompeleteTodoIdList: (state) => {
      // 返回包含未完成待办事项 id 的数组
      return state.todoList
        .filter((todo) => !todo.isDone)
        .map((todo) => todo.id);
    },
    compeletedTodoIdList: (state) => {
      // 返回包含已完成待办事项 id 的数组
      return state.todoList
        .filter((todo) => todo.isDone)
        .map((todo) => todo.id);
    },
    xzzdTodoList: (state) => {
      return state.todoList.filter((todo) => todo.isXZZD);
    },
    xzzdTodoIdList: (state) => {
      return state.todoList
        .filter((todo) => todo.isXZZD)
        .map((todo) => todo.xzzdId || "");
    },
    getToDoByYearMonth(state) {
      const calendarStore = useCalendarStore();
      // 将 year 和 month 转换为字符串并格式化为 YYYY-MM 格式
      const yearMonth =
        String(calendarStore.setting.year).padStart(4, "0") +
        "-" +
        String(calendarStore.setting.month).padStart(2, "0");
      return state.todoList
        .filter((todo) => !todo.isDone)
        .filter((todo) => {
          const todoYearMonth = todo.time.slice(0, 7);
          return todoYearMonth == yearMonth;
        });
    },
    getToDoOfDay(state) {
      const calendarStore = useCalendarStore();
      const yearMonthDay =
        String(calendarStore.setting.selectDay.year).padStart(4, "0") +
        "-" +
        String(calendarStore.setting.selectDay.month).padStart(2, "0") +
        "-" +
        String(calendarStore.setting.selectDay.day).padStart(2, "0");
      return state.todoList
        .filter((todo) => !todo.isDone)
        .filter((todo) => {
          return yearMonthDay == todo.time.slice(0, 10);
        });
    },
    getTodoListOfUrl(state) {
      if(state.setting.addXZZDToUrl){
        return state.todoList.filter((todo) => !todo.isDone).map((todo) => {
          return {
            time: todo.time,
            content: todo.content,
            location: todo.location,
            title: todo.isXZZD ? todo.content+"-"+todo.course  : todo.content
          }
        })
      }else{
        return state.todoList.filter((todo) => !todo.isDone && !todo.isXZZD).map((todo) => {
          return {
            time: todo.time,
            content: todo.content,
            location: todo.location,
            title: todo.content 
          }
        })
      }
    
    }
  },
  persist: {
    key: "todoListStore", // 存储键名
    storage: window.localStorage, // 存储类型
  },
});
