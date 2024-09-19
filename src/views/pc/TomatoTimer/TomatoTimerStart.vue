<template>
    <div class="timerLayout">
        <div></div>
        <div class="turn">{{ timerStatus.currentCycle }} / {{ tomatoTimerStore.tomatoTimerSetting.cycleCount }}</div>
        <div class="timerDisplay">{{ tomatoTimerStore.getDisplayTime }}</div>
        <div class="status">{{ timerStatus.currentStatus == "focus"? "专注中" : "" }} {{ timerStatus.currentStatus == "break"? "休息中" : "" }} {{ timerStatus.currentStatus == "pause"? "已暂停" : "" }}</div>
        <div class="buttons">
            <el-button class="mybutton" @click="stopClock" :icon="CircleClose" circle></el-button>
            <el-button class="mybutton" @click="pauseOrContinue"
                :icon="isPause?VideoPlay:VideoPause" @keyup.space="pauseOrContinue" circle />
            <el-button class="mybutton" @click="restartClock" :icon="Refresh" circle></el-button>
        </div>
    </div>
</template>
<script setup>
import { useTomatoTimerStore } from '@/stores/tomatoTimerStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import EventBus from '@/script/eventBus'
import { VideoPlay, VideoPause, CircleClose, Refresh } from '@element-plus/icons-vue';
const router = useRouter();

const tomatoTimerStore = useTomatoTimerStore();
const timerStatus = tomatoTimerStore.tomatoTimerStatus
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
const pauseOrContinue=()=>{
    if(tomatoTimerStore.tomatoTimerStatus.currentStatus!="pause"){
        isPause.value=true
        pauseClock()
    }else{
        isPause.value=false
        continueClock()
    }
}
const pauseClock = () => {
    console.log('pauseClock')
    EventBus.emit('pauseOrStopClock', "pause")
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
.status{
    margin-top: 3%;
    height:25px;
}
.buttons{
    margin-top:5%;
    width: 40%;
    display: flex;
    flex-direction: row;
    justify-content: space-between
}
</style>