<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue';
const { proxy } = getCurrentInstance();
import { useUserInfoStore } from './stores/userInfoStore';
import { useCourseTableStore } from './stores/courseTableStore';
import { useTodoListStore } from './stores/todoListStore';
import { formatDateTime } from './script/formatTime';
import { useTomatoTimerStore } from './stores/tomatoTimerStore';
import { useCalendarStore } from './stores/calendarStore';
import { useRouter } from 'vue-router';
import axios from 'axios';


const router = useRouter();
const courseTableStore = useCourseTableStore();
const userInfoStore = useUserInfoStore();
const todoListStore = useTodoListStore();
const tomatoTimerStore = useTomatoTimerStore();
const calendarStore = useCalendarStore();
const timerStatus = tomatoTimerStore.tomatoTimerStatus;
const timerSetting = tomatoTimerStore.tomatoTimerSetting;

const dialogVisible = ref(false);

import EventBus from './script/eventBus';
import { ElMessage, ElMessageBox } from 'element-plus';



const audio = ref();
const playVedio = () => {
  if (audio.value) {
    audio.value.play();
  }
};

const handleUpdate = () => {

  dialogVisible.value = false;
  window.electronAPI.toInstall();
}

let timerInterval = null;

/* setTimeout(async () => {
  console.log('app execute getCourseTable')
  let result = await window.electronAPI.getCourseTable("1","2024")
  //console.log('after transform:',result.replace(/True/g,'true').replace(/False/g, 'false').replace(/\'/g, '"'))
  result = JSON.parse(result.replace(/True/g,'true').replace(/False/g, 'false').replace(/\'/g, '"'))
  //console.log('app execute getCourseTable result:',result)
  console.log('app getCourseTable result:',result) 
  window.electronAPI.setData('courseTable', result)
  const courseTable = await window.electronAPI.getData('courseTable')
  console.log('app getData result:',courseTable)
}, 3000) */
//const test = await window.electronAPI.getDate('test')
//console.log('app getDate result test:',test)
onMounted(() => {
  /*   console.log('import.meta.env.prod', import.meta.env.PROD)
    console.log('imort.meta.env', import.meta.env)
    setTimeout(() => {
      console.log('set loading true')
      courseTableStore.setLoading(true)
      }
     , 6000)
    setTimeout(() => {
      console.log('set loading false')
      courseTableStore.setLoading(false)
      }
     , 12000) */
  // 
  // 刚登录时初始化一下，防止加载bug
  /* window.electronAPI.notify(JSON.stringify({
    title: "欢迎使用ZTimer",
    body: "ZTimer是一个开源的应用，你可以使用它来提高你的工作效率。"
  })) */

  // 设置今天为被选中的日期
  calendarStore.initSelectDay()

  courseTableStore.setLoading(false)
  todoListStore.setting.isLoading = false
  userInfoStore.setting.isLoading = false
  todoListStore.setting.isGetUrlLoading = false

  EventBus.on('updateToDo', () => {
    todoListStore.setting.isLoading = true
    let requestInfo = {
      mode: '2',
      account: userInfoStore.accountInfo.account,
      password: userInfoStore.accountInfo.password
    }
    window.electronAPI.request(JSON.stringify(requestInfo)).then(result => {
      result = JSON.parse(result.replace(/True/g, 'true').replace(/False/g, 'false').replace(/\'/g, '"').replace(/None/g, 'null'))
      if (result.status == "success") {
        //如果请求成功，保存数据
        const todoList = result.data
        if (todoList.length != 0) {
          const xzzdIds = todoListStore.xzzdTodoIdList
          todoList.forEach((item) => {
            if (xzzdIds.indexOf(item['id']) == -1) {
              console.log("xzzd todo:", item)
              todoListStore.addTodo({
                course: item['course_name'] || '',
                type: item['type'] || '',
                content: item['title'] || '',
                isXZZD: true,
                xzzdId: item['id'] || '',
                time: formatDateTime(item['end_time']) || '',
              })
            }

          })
          console.log('after add xzzd todo:', todoListStore.todoList)
        }
        todoListStore.lastUpdateTime = new Date().toLocaleString();
        todoListStore.setting.isLoading = false
        if (todoListStore.setting.openUrlLink) {
          EventBus.emit('getUrlLink')
        }
      } else {
        todoListStore.setting.isLoading = false
        ElMessage({
          message: '获取待办事项失败,请检查网络连接或联系开发者',
          type: 'error'
        })
      }

    })
  })

  EventBus.on('getYjsToken', () => {
    console.log('getYjsToken')
    let requestInfo = {
      mode: "3",
      account: userInfoStore.accountInfo.account,
      password: userInfoStore.accountInfo.password,
    }
    window.electronAPI.request(JSON.stringify(requestInfo)).then(result => {
      result = JSON.parse(result.replace(/True/g, 'true').replace(/False/g, 'false').replace(/\'/g, '"'))
      console.log("login result:", result);
      if (result.status === 'success') {
        console.log("login result:", result);
        userInfoStore.setAccountInfo({
          account: userInfoStore.accountInfo.account,
          password: userInfoStore.accountInfo.password,
          loginStatus: true,
          role: userInfoStore.accountInfo.role,
          token: result.data,
          tokenExpireTime: new Date().getTime() + 1000 * 60 * 60 * 5 // 5h后过期
        });
        // 设置个5h的计时器，过期后自动重新获取token
        if (userInfoStore.setting.updateTokenTimer) {
          clearTimeout(userInfoStore.setting.updateTokenTimer);
        }
        userInfoStore.setting.updateTokenTimer = setTimeout(() => {
          EventBus.emit('getYjsToken')
        }, 1000 * 60 * 60 * 5);
      } else {
        ElMessage({
          message: result.message,
          type: 'token update error',
        })
      }
    })
  })

  EventBus.on('getUrlLink', () => {
    todoListStore.setting.isGetUrlLoading = true
    if (userInfoStore.accountInfo.loginStatus == false || todoListStore.setting.openUrlLink == false) {
      todoListStore.setting.isGetUrlLoading = false
      return;
    }
    const url = "http://zjumsc.com/api/updateTodo.php"
    console.log('todoListStore.getTodoListOfUrl:', todoListStore.getTodoListOfUrl)
    axios.post(url, {
      username: userInfoStore.accountInfo.account,
      todoList: todoListStore.getTodoListOfUrl
    }).then(result => {
      console.log('getUrlLink result:', result)
      if (result.data.status == "success") {
        todoListStore.setting.urlLink = result.data.data
        todoListStore.setting.isGetUrlLoading = false
      } else {
        ElMessage({
          message: result.data.msg,
          type: 'error'
        })
      }
    }).catch(error => {
      todoListStore.setting.isGetUrlLoading = false
      console.log('getUrlLink error:', error)
      ElMessage({
        message: '获取待办事项失败,请检查网络连接或联系开发者',
        type: 'error'
      })
    })
  }
  )

  EventBus.on('updateCourseTable', () => {

    console.log('updateCourseTable tableSetting:', courseTableStore.courseTableSetting)

    courseTableStore.setLoading(true)
    console.log('set loading true')
    const courseTableStoreKey = userInfoStore.accountInfo.role + "-" + "courseTable-" + courseTableStore.courseTableSetting.year + "-" + courseTableStore.courseTableSetting.xq
    const term = courseTableStore.courseTableSetting.term
    if (userInfoStore.accountInfo.role == '0') {
      let requestInfo = {
        mode: '1',
        account: userInfoStore.accountInfo.account,
        password: userInfoStore.accountInfo.password,
        xq: courseTableStore.courseTableSetting.xq,
        xn: courseTableStore.courseTableSetting.year,
      }
      window.electronAPI.request(JSON.stringify(requestInfo)).then(result => {
        result = JSON.parse(result.replace(/True/g, 'true').replace(/False/g, 'false').replace(/\'/g, '"'))
        if (result.status == "success") {
          //如果请求成功，保存数据
          console.log('app mounted getCourseTable result:', result)
          const courseTable = result.data
          console.log('app mounted getCourseTable result:', courseTable)
          let newcourseTable = []
          for (let i = 0; i < 7; i++) {
            newcourseTable.push({
              week: i + 1,
              courses: []
            })
          }
          const regex = /(.+?)<br>.+?<br>(.+?)<br>(.+?)zwf(\d{4}年\d{2}月\d{2}日)\((\d{2}:\d{2}-\d{2}:\d{2})\)zwf/;
          const noExamRegex = /(.+?)<br>.+?<br>(.+?)<br>(.+?)zwfzwf/;

          courseTable['kbList'].forEach(course => {
            // 使用正则表达式匹配字符串
            let match = course['kcb'].match(regex);
            const type = 0;//考试类型 0:考试 1:非考试
            if (!match) {
              match = course['kcb'].match(noExamRegex);
              const type = 1;
            } else {

            }
            if (match) {
              const courseName = match[1];
              const teacherName = match[2];
              const location = match[3];
              let examDate = "no value";
              let examTime = "no value";
              if (type == 0) {
                examDate = match[4];
                examTime = match[5];
              }
              console.log("课程名:", courseName);
              console.log("教师名:", teacherName);
              console.log("上课地点:", location);
              console.log("考试日期:", examDate);
              console.log("考试时间:", examTime);
              let newcourse = {
                courseName: courseName,
                teacher: teacherName,
                classPlace: location,
                examTime: examDate + ' ' + examTime,
                index: course['djj'],
                num: course['skcd'],
                term: course['xxq'],
                startTime: proxy.$timeTable[course['djj'] - 1]['start'],
                endTime: proxy.$timeTable[parseInt(course['djj']) - 1 + parseInt(course['skcd']) - 1]['end'],
                week: course['xqj'],
                mode: course['dsz']
              }
              console.log('newcourse:', newcourse)
              newcourseTable[course['xqj'] - 1]['courses'].push(newcourse)
            } else {
              console.log("未匹配到信息:", course['kcb']);
            }

          });
          courseTableStore.courseTable[courseTableStore.courseTableSetting.year][term].data = newcourseTable
          courseTableStore.courseTable[courseTableStore.courseTableSetting.year][term].lastUpdate = new Date().toLocaleString();
          /*  proxy.$courseTable[courseTableStore.courseTableSetting.term].courses = newcourseTable
           proxy.$courseTable[courseTableStore.courseTableSetting.term].lastUpdate = new Date().toLocaleString();
           console.log('app mounted $courseTable[', term, ']:', proxy.$courseTable[term])
           console.log('set loading false')
 
           window.electronAPI.setData(courseTableStoreKey, JSON.stringify(proxy.$courseTable[term])) */
          courseTableStore.setLoading(false)

        }
        console.log('app request result:', result)
      })
    } else {
      let requestInfo = {
        mode: '4',
        xq: courseTableStore.courseTableSetting.xq,
        xn: courseTableStore.courseTableSetting.year,
        token: userInfoStore.accountInfo.token
      }
      window.electronAPI.request(JSON.stringify(requestInfo)).then(result => {
        result = JSON.parse(result.replace(/True/g, 'true').replace(/False/g, 'false').replace(/\'/g, '"'))
        console.log('request result of mode 4:', result)
        if (result.success) {
          courseTableStore.courseTable[courseTableStore.courseTableSetting.year][term].data = result['result']['kcbMap']
          courseTableStore.courseTable[courseTableStore.courseTableSetting.year][term].lastUpdate = new Date().toLocaleString();
        }
        courseTableStore.setLoading(false)

      })
    }
  })

  EventBus.on('onLoad', () => {
    const year = courseTableStore.courseTableSetting.year
    const term = courseTableStore.courseTableSetting.term

    console.log('onLoad')
    if (userInfoStore.accountInfo.loginStatus == true) {
      if (todoListStore.setting.updateOnLoad) { EventBus.emit('updateToDo') }
    }
    if (courseTableStore.courseTable[year][term] && courseTableStore.courseTable[year][term].lastUpdate != "") {
      console.log('courseTable data exist, no request', term, year, "data:", courseTableStore.courseTable[year][term].data)
    } else {
      if (userInfoStore.accountInfo.loginStatus == true) {
        //如果登录了，请求数据
        console.log('no coureseTable data, request data')
        EventBus.emit('updateCourseTable')
      }
      else {
        //如果没有登录，跳转登录页面
      }
    }
    if(userInfoStore.accountInfo.role == "3"){
      if(userInfoStore.setting.updateTokenTimer){
        clearTimeout(userInfoStore.setting.updateTokenTimer);
      }
      EventBus.emit('getYjsToken')
    }

    //检测是否有缓存的短学期课表数据
    /* const courseTableStoreKey = "courseTable-" + courseTableStore.courseTableSetting.year + "-" + courseTableStore.courseTableSetting.xq
    const term = courseTableStore.courseTableSetting.term
    window.electronAPI.getData(courseTableStoreKey).then(result => {
      console.log('getData:', courseTableStoreKey, ' result:', result)
      if (!result) {
        //如果没有秋学期数据
        //先检查是否登录
        if (userInfoStore.accountInfo.loginStatus == true) {
          //如果登录了，请求数据
          console.log('no coureseTable data, request data')
          EventBus.emit('updateCourseTable')

        }

        else {
          //如果没有登录，跳转登录页面
        }
      } else {
        //如果有缓存的秋学期课表数据
        console.log('app mounted getData result:', result)
        proxy.$courseTable[term] = JSON.parse(result)
        console.log('app mounted $courseTable[', term, ']:', proxy.$courseTable[term])
      }
    }) */
  })
  EventBus.on('pauseOrStopClock', (status) => {

    console.log('app vue pauseOrStopClock')
    console.log(timerInterval)
    clearInterval(timerInterval)
    timerInterval = null
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    if (status == "stop") {
      timerSetting.isStart = false
    }
    timerStatus.lastStatus = timerStatus.currentStatus
    timerStatus.currentStatus = status
  })

  EventBus.on('startClock', () => {
    console.log('app vue startClock')
    // 开启定时器
    if (timerInterval) {
      console.log('timer already exit, clear and start new timer')
      clearInterval(timerInterval)
      timerInterval = null
    }
    timerSetting.isStart = true
    timerInterval = setInterval(() => {
      console.log('interval tick')
      switch (tomatoTimerStore.tomatoTimerStatus.currentStatus) {
        case "start":
          timerStatus.currentCycle = 1
          timerStatus.currentTurnTime = tomatoTimerStore.getFocusTimerByS
          timerStatus.currentStatus = "focus"
          timerSetting.isStart = true
          break;
        case "focus":
          if (timerStatus.currentTurnTime > 0) {
            // 专注状态，正常
            timerStatus.currentTurnTime--
          } else {
            // 专注时间结束
            if (timerSetting.openOSNotification) {
              window.electronAPI.notify(JSON.stringify({
                title: "专注时间结束",
                body: "现在进入休息时间"
              }))
            }
            if (timerSetting.openSoundNotification) {
              playVedio()
            }
            if (timerStatus.currentCycle == timerSetting.cycleCount) {
              // 最后一轮
              timerStatus.currentStatus = "stop"
            } else {
              // 非最后一轮
              timerStatus.currentTurnTime = tomatoTimerStore.getBreakTimerByS
              timerStatus.currentStatus = "break"
            }
          }
          break;
        case "break":
          if (timerStatus.currentTurnTime > 0) {
            // 短休息状态，正常
            timerStatus.currentTurnTime--
          } else {
            // 短休息时间结束
            if (timerSetting.openOSNotification) {
              window.electronAPI.notify(JSON.stringify({
                title: "休息时间结束",
                body: "现在进入下一轮专注时间"
              }))
            }
            if (timerSetting.openSoundNotification) {
              playVedio()
            }
            timerStatus.currentCycle++
            timerStatus.currentTurnTime = tomatoTimerStore.getFocusTimerByS
            timerStatus.currentStatus = "focus"
          }
          break;
        case "pause":
          timerStatus.currentStatus = timerStatus.lastStatus
          if (timerStatus.currentTurnTime > 0) {
            timerStatus.currentTurnTime--
          }
          break;
        default:
          console.log('unknown status:', timerStatus.currentStatus)
          break;
      }
    }, 1000)

  })
  window.electronAPI.test(() => {
    console.log('app webcontent test')
    dialogVisible.value = true;
  })
  window.electronAPI.onDownloaded(() => {
    console.log('app vue onDownloaded')
    dialogVisible.value = true;
  })

  EventBus.emit('onLoad')

})

onUnmounted(() => {
  EventBus.off('onLoad')
  EventBus.off('updateCourseTable')
  EventBus.off('updateToDo')
  EventBus.off('startClock')
  EventBus.off('pauseOrStopClock')
  EventBus.off('getUrlLink')
  EventBus.off('getYjsToken')
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
})
</script>

<template>
  <audio hidden ref="audio">
    <source src="@/assets/notify.mp3" type="audio/ogg" />
  </audio>
  <el-dialog v-model="dialogVisible" title="Tips" width="500">
    <span>新版本下载完成，是否立刻更新？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdate">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <router-view></router-view>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {


  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
