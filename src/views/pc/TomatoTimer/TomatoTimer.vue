<template>
    <div class="tomatoTimer">
        <el-form style="width:700px;">
            <el-form-item class="slider-block" lable="单轮专注时间(分钟)">
                <span class="slider-label">单轮专注时间(分钟)</span>
                <el-slider class="slider" :min="1" :max="70" v-model="setting.singleFocusTime" show-input />
            </el-form-item>
            <el-form-item class="slider-block" lable="单轮休息时间">
                <span class="slider-label">单轮休息时间</span>
                <el-slider class="slider" :min="1" :max="40" v-model="setting.shortBreakTime" show-input />
            </el-form-item>
            <el-form-item class="slider-block" lable="专注轮次">
                <span class="slider-label">专注轮次</span>
                <el-slider class="slider" :min="1" :max="20" v-model="setting.cycleCount" show-input />
            </el-form-item>
            <el-form-item>
                <span
                    style="margin-right:13px;">总时长：{{ tomatoTimerStore.getTotalTime >= 60 ? (tomatoTimerStore.getTotalTime / 60).toFixed(1) + 'h' : tomatoTimerStore.getTotalTime + 'min' }}</span>
                <span>总专注时长：{{ tomatoTimerStore.getTotalFocusTime >= 60 ? (tomatoTimerStore.getTotalFocusTime / 60).toFixed(1) + 'h' : tomatoTimerStore.getTotalFocusTime + 'min' }}</span>
            </el-form-item>
            <el-form-item class="button-block">
                <el-button @click="startClock">开始</el-button>
            </el-form-item>
        </el-form>
        <div class="record" v-if="timerSetting.openRecord.setting">
            <div class="record-focus">今日净专注：{{ timerSetting.record[todayStr].focusTime>= 3600 ? (timerSetting.record[todayStr].focusTime / 3600).toFixed(1) + 'h' : (timerSetting.record[todayStr].focusTime / 60).toFixed(0) + 'min' }} </div>
            <div class="record-total">今日总专注：{{ timerSetting.record[todayStr].totalTime>= 3600 ? (timerSetting.record[todayStr].totalTime / 3600).toFixed(1) + 'h' : (timerSetting.record[todayStr].totalTime / 60).toFixed(0) +'min' }} </div>
        </div>
    </div>

</template>
<script setup>
import { useTomatoTimerStore } from '@/stores/tomatoTimerStore';
import { useRouter } from 'vue-router';
import EventBus from "@/script/eventBus"
import { todayTime } from '@/script/getTodayTime';

const router = useRouter();
const tomatoTimerStore = useTomatoTimerStore();
const timerSetting = tomatoTimerStore.tomatoTimerSetting
const todayStr = todayTime()
if (!timerSetting.record[todayStr]) {
        timerSetting.record[todayStr] = {
          focusTime: 0,
          totalTime: 0
        }
      }
const setting = tomatoTimerStore.tomatoTimerSetting;
const startClock = () => {
    console.log('startClock')
    tomatoTimerStore.tomatoTimerStatus.currentStatus = "start"
    EventBus.emit("startClock")
    router.push('/tomatotimerstart')
}
</script>
<style scoped lang="less">
.tomatoTimer {
    margin-top:11%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-left: 13%;
    width: 100%;
    height: 60%;
}

.slider-block {
    :deep .el-form-item__content {
        flex-wrap: nowrap;
    }

    margin-left:0;
    width: 650px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
}

.slider {
    max-width: 380px;
}

.slider-label {
    width: 150px;
    text-align: left;
    margin-right: 10px;
}
.button-block{
    :deep .el-form-item__content{
        padding-left: 25%;
    }
}
.record{
    margin-top: 15%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    width: 100%;
}
.record-total{

    color: hsla(0, 2%, 10%, 0.49);
}
.record-focus{

    color: hsla(0, 2%, 10%, 0.49);
}
</style>