<template>
    <div class="timerLayout">
        <div></div>
        <div class="turn">{{ timerStatus.currentCycle }} / {{ tomatoTimerStore.tomatoTimerSetting.cycleCount }}</div>
        <div class="timerDisplay">{{ tomatoTimerStore.getDisplayTime }}</div>
        <div class="status">{{ timerStatus.currentStatus == "focus" ? "专注中" : "" }} {{ timerStatus.currentStatus ==
            "break" ? "休息中" : "" }} {{ timerStatus.currentStatus == "pause" ? "已暂停" : "" }}</div>
        <div class="buttons">
            <el-tooltip content="退出" style="margin: 4px;" placement="bottom">
                <el-button class="mybutton" @click="stopClock" :icon="CircleClose" circle></el-button>
            </el-tooltip>
            <el-tooltip content="暂停/继续" style="margin: 4px;" placement="bottom">
                <el-button class="mybutton" @click="pauseOrContinue" :icon="isPause ? VideoPlay : VideoPause"
                    @keyup.space="pauseOrContinue" circle />
            </el-tooltip>

            <el-tooltip content="重新开始" style="margin: 4px;" placement="bottom">
                <el-button class="mybutton" @click="restartClock" :icon="Refresh" circle></el-button>
            </el-tooltip>
            <!--跳过当前阶段按钮-->
            <el-tooltip content="跳过当前休息/专注时间" style="margin: 4px;" placement="bottom">
                <el-button class="mybutton" @click="skipCurrentStage" :icon="RefreshRight" circle></el-button>
            </el-tooltip>
        </div>
        <div class="record" v-if="timerSetting.openRecord.clock">
            <div class="record-focus">今日净专注：{{ timerSetting.record[todayStr].focusTime >= 3600 ?
                (timerSetting.record[todayStr].focusTime / 3600).toFixed(1) + 'h' :
                (timerSetting.record[todayStr].focusTime / 60).toFixed(0) + 'min' }} </div>
            <div class="record-total">今日总专注：{{ timerSetting.record[todayStr].totalTime >= 3600 ?
                (timerSetting.record[todayStr].totalTime / 3600).toFixed(1) + 'h' :
                (timerSetting.record[todayStr].totalTime / 60).toFixed(0) + 'min' }} </div>
        </div>
    </div>
</template>
<script setup>
import { useTomatoTimerStore } from '@/stores/tomatoTimerStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import EventBus from '@/script/eventBus'
import { VideoPlay, VideoPause, CircleClose, Refresh, ArrowRight, RefreshRight } from '@element-plus/icons-vue';
import { todayTime } from '@/script/getTodayTime';
const router = useRouter();

const tomatoTimerStore = useTomatoTimerStore();
const timerStatus = tomatoTimerStore.tomatoTimerStatus
const timerSetting = tomatoTimerStore.tomatoTimerSetting
const todayStr = todayTime()
if (!timerSetting.record[todayStr]) {
    timerSetting.record[todayStr] = {
        focusTime: 0,
        totalTime: 0
    }
}

let isPause = ref(tomatoTimerStore.tomatoTimerStatus.currentStatus == "pause")
if (timerStatus.currentStatus == "start") { timerStatus.currentTurnTime = tomatoTimerStore.getFocusTimerByS }
const stopClock = () => {
    console.log('stopClock')
    EventBus.emit('pauseOrStopClock', "stop")
    router.push('/tomatotimerconfig')
}
console.log('displayedTime:', tomatoTimerStore.getDisplayTime)
const continueClock = () => {
    console.log('continueClock')
    EventBus.emit('startClock')
}
const restartClock = () => {
    console.log('restartClock')
    tomatoTimerStore.tomatoTimerStatus.currentStatus = "start"
    EventBus.emit("startClock")
}
const pauseOrContinue = () => {
    if (tomatoTimerStore.tomatoTimerStatus.currentStatus != "pause") {
        isPause.value = true
        pauseClock()
    } else {
        isPause.value = false
        continueClock()
    }
}
const pauseClock = () => {
    console.log('pauseClock')
    EventBus.emit('pauseOrStopClock', "pause")
}
const skipCurrentStage = () => {
    // 如果是暂停状态，则继续计时
    if (tomatoTimerStore.tomatoTimerStatus.currentStatus == "pause") {
        continueClock()
        setTimeout(() => {
            EventBus.emit('overCurrentTurn')
        }, 1100)
    } else {
        console.log('skipCurrentStage')
        EventBus.emit('overCurrentTurn')
    }

}
</script>

<style scoped>
.timerLayout {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-top: 6%;
}

.timerDisplay {
    border: 1px solid var(--el-border-color);
    border-radius: 20px;
    font-size: 50px;
    padding: 10px;
    box-shadow: 0px 1px 2px 1px;
    font-weight: bold;
}

.turn {
    color: hsla(0, 2%, 10%, 0.49);
    margin-bottom: 13px;
}

.mybutton {
    border: none;
    padding: 0;
    font-size: 55px;
}

.status {
    margin-top: 3%;
    height: 25px;
}

.buttons {
    margin-top: 5%;
    width: 40%;
    display: flex;
    flex-direction: row;
    justify-content: space-between
}

.record {
    margin-top: 15%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    width: 100%;
}

.record-total {

    color: hsla(0, 2%, 10%, 0.49);
}

.record-focus {

    color: hsla(0, 2%, 10%, 0.49);
}

.el-tooltip__popper {
    padding: 8px 10px;
}
</style>