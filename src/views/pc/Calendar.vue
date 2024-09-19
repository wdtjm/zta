<script></script>
<template>
    <div style="font-size: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center;flex-direction: row;">
        <div style="display: flex; justify-content: flex-start; align-items: center;flex-direction: row;">
        <el-button style="margin:10px;" @click="calendarStore.subMonth"><</el-button>
        <div> {{ calendarStore.setting.year }} {{ calendarStore.setting.month }}</div>
        <el-button style="margin:10px;" @click="calendarStore.addMonth">></el-button>
        </div>
        <div style="margin-left: 10%;font-size: 14px;">
            学在浙大待办更新于：{{todoListStore.lastUpdateTime == ""?"暂无数据":todoListStore.lastUpdateTime}}
            <el-button style="margin-left: 10px;" :loading="todoListStore.setting.isLoading" :icon="Refresh" round  @click="updateTodo()"></el-button>
        </div>
         </div>
        <el-table :data="calendarStore.getData" :header-cell-style="{ 'text-align': 'center' }" style="width: 100%">
            <el-table-column v-for="index in 7" align="center" :key="index" :label="numToString(index % 7)">
                <template #default="scope">
                    <div v-if="scope.row[index % 7]" class="total-day">
                        <div @click="selectDay(scope.row[index % 7])"
                            :class="{ 'is-today': scope.row[index % 7]['isToday'], 'day': true, 'selected': isSelected(scope.row[index % 7]['date']) }">
                            <span :style="{ 'color': scope.row[index % 7]['isCurrentMonth'] ? 'black' : 'gray' }">
                                {{ scope.row[index % 7]["day"] }}</span>
                        </div>
                        <div class="dots">
                            <div v-for="i in scope.row[index % 7]['todoNum']" class="dot"></div>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <div>待办事项</div>
            <div class="incompeleteTodoList" v-for="todo in todoListStore.getToDoOfDay" :key="todo.id">
                <el-checkbox :class="{ 'strike-through': true, 'active': todo.isActive }" :id="String.toString(todo.id)"
                    :label="todo.id" :key="todo.id" @change="addDoneList(todo.id)">
                    {{ todo.time }} {{ todo.content }}{{ todo.isXZZD ? ' ' + todo.course : '' }}
                    <el-tag size="small" effect="plain" v-if="todo.isXZZD" type="primary">xzzd</el-tag>
                </el-checkbox>
            </div>
        </div>
    </div>
</template>
<script setup>
import EventBus from "@/script/eventBus";
import { computed, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { generateCalendarData } from "@/script/generateCalendarData";
import { ref } from 'vue';
import { useCalendarStore } from "@/stores/calendarStore";
import { useTodoListStore } from "@/stores/todoListStore";
import { Refresh } from "@element-plus/icons-vue";

const todoListStore = useTodoListStore();
const calendarStore = useCalendarStore();
const getScope = (scope) => {
    console.log(scope)
    return "1"
};
const updateTodo = ()=>{
    EventBus.emit('updateTodo');
}
const consoleData = (data) => {
    console.log(data)
}
const numToString = (num) => {
    const str = ['日', '一', '二', '三', '四', '五', '六']
    return str[num]
}
const selectDay = (day) => {
    calendarStore.setting.selectDay.day = day.day;
    calendarStore.setting.selectDay.month = day.month;
    calendarStore.setting.selectDay.year = day.date.getFullYear();
    console.log('selectDay', calendarStore.setting.selectDay)
    console.log('todoListStore.getTodoOfDay', todoListStore.getTodoOfDay)
}
const isSelected = (date) => {
    if (calendarStore.setting.selectDay.year === date.getFullYear() &&
        calendarStore.setting.selectDay.month === date.getMonth() + 1 &&
        calendarStore.setting.selectDay.day === date.getDate()) {
        return true;
    }
}
const addDoneList = (id) => {
    todoListStore.toggleActive(id)
    
    setTimeout(() => {

        todoListStore.updateTodoStatus(id)
        todoListStore.toggleActive(id)
    }, 300)
}
onMounted(() => {
    console.log("Calendar mounted")

    //console.log(`2023年10月的日历数据:`, calendarData);
})


</script>
<style scoped>
.total-day {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    flex-wrap: nowrap;
}

.dots {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    z-index: -1;
}

.dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgb(219, 41, 41);
    margin: 0 1px;
}

.el-table {
    --el-table-border-color: #ffffff;
    --el-table-row-hover-bg-color: none;
}

.day {
    border-radius: 50%;
    height: 45px;
    width: 45px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.day:hover {
    cursor: pointer;
    background-color: hsla(207, 100%, 50%, 0.32);
}

.is-today {
    background-color: rgb(150 164 164 / 55%);
}

.selected {
    background-color: hsla(207, 98%, 50%, 0.462);
}

:deep(.el-table .cell) {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0;
}

.strike-through::after{
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px; /* 横线的粗细 */
    background-color: rgb(0, 51, 255); /* 横线的颜色 */
    transform: scaleX(0);
    transform-origin: left;
    animation: strike 0.3s forwards; /* 动画持续时间 */
    display: none;
}
.strike-through.active::after{
    display: block;
}
/* 定义动画 */
@keyframes strike {
    0% {
        transform: scaleX(0);
    }
    100% {
        transform: scaleX(1);
    }
}
.incompeleteTodoList{
    margin-left:20px;
}
</style>