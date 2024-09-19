// src/stores/courseTableStore.js
import { defineStore } from "pinia";
import { getCurrentInstance } from "vue";
const proxy = getCurrentInstance();

export const useCourseTableStore = defineStore("courseTable", {
  state: () => ({
    courseTableSetting: {
      year: "2024",
      lastUpdate: "",
      mode: "1", // single or double
      term: "fall", // spring, summer, fall, winter
      xq: "1",
      isLoading: false,
      show: true,
    },
    courseTable: {
      2023: {
        fall: {lastUpdate: "", data: []},
        spring: {lastUpdate: "", data: [] },
        summer: {lastUpdate: "", data: [] },
        winter: {lastUpdate: "", data: []},
      },
      2024: {
        fall: {lastUpdate: "", data: []},
        spring: {lastUpdate: "", data: []},
        summer: {lastUpdate: "", data: []},
        winter: {lastUpdate: "", data: []},
      },
      2025: {
        fall: {lastUpdate: "", data: []},
        spring: {lastUpdate: "", data: []},
        summer: {lastUpdate: "", data: []},
        winter: {lastUpdate: "", data: []},
      },
    }, // 初始化为空数组
    timeTable:[
      {"number": 1, "start": "8:00", "end": "8:45"},
      {"number": 2, "start": "8:50", "end": "9:35"},
      {"number": 3, "start": "10:00", "end": "10:45"},
      {"number": 4, "start": "10:50", "end": "11:35"},
      {"number": 5, "start": "11:40", "end": "12:25"},
      {"number": 6, "start": "13:25", "end": "14:10"},
      {"number": 7, "start": "14:15", "end": "15:00"},
      {"number": 8, "start": "15:05", "end": "15:50"},
      {"number": 9, "start": "16:15", "end": "17:00"},
      {"number": 10, "start": "17:05", "end": "17:50"},
      {"number": 11, "start": "18:50", "end": "19:35"},
      {"number": 12, "start": "19:40", "end": "20:25"},
      {"number": 13, "start": "20:30", "end": "21:15"}
    ],
  }),
  actions: {
    setLoading(payload) {
      this.courseTableSetting.isLoading = payload;
    },
    setCourseTableSetting(payload) {
      this.courseTableSetting = payload;
    },
    setWeekCourse(payload) {
      this.weekCourse = payload;
    },
  },
  getters:{
    isMaxYear( state){
      return state.courseTableSetting.year === "2025"
    },
    isMinYear(state){
      return state.courseTableSetting.year === "2023"
    },
    getYjsCourseTable(state){
      const rawtable = state.courseTable[state.courseTableSetting.year][state.courseTableSetting.term].data;
      if(rawtable == null || rawtable.length === 0){
        return []
      }
      let newcourseTable = []
          for (let i = 0; i < 7; i++) {
            newcourseTable.push({
              week: i + 1,
              courses: []
            })
          }
          const data = rawtable
          for(let key in data){ // key 是周几
            const course = data[key]
            for(let index in data[key]){
            
              console.log('data[key][index]',"key:",key,"index:",index,"data[key][index]",data[key][index])
              console.log(data[key][index]['pyKcbjSjddVOList'])
              const item = data[key][index]['pyKcbjSjddVOList'][0]
              newcourseTable[parseInt(key)-1].courses.push({
                courseName: item.kcmc,
                teacher: item.xm,
                classPlace: item.cdmc,
                examTime: "",
                index: index,
                num: "1",
                term: item.pkxqMc,
                startTime: state.timeTable[parseInt(index) - 1]['start'],
                endTime: state.timeTable[parseInt(index) - 1]['end'],
                week: key,
                mode: item.dszMc == "每周" || item.dszMc == "自定义" ? 2 : item.dszMc == "单周" ? 0 : item.dszMc == "双周" ? 1 : 2,// 1表示双周, 0表示单周, 2表示不分单双周
              })
            }
          }
          return newcourseTable}
               

  },
  persist: {
    key: "courseTableStore", // 存储键名
    storage: window.localStorage, // 存储类型
  },
});
