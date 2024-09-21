<template>
    <div>
        <el-form :model="form" label-position="left" label-width="auto"  style="max-width: 700px">
            <el-form-item label="登录信息" v-if="userInfoStore.accountInfo.loginStatus">
                {{ userInfoStore.accountInfo.account }}
                <el-button type="text" @click="logout">退出登录</el-button>
            </el-form-item>
            <el-form-item label="用户名" v-else>
                未登录
                <el-button type="text" @click="login">登录</el-button>
            </el-form-item>
            <el-form-item label="应用打开时的默认页面">
                <el-select v-model="userInfoStore.setting.defaultPage">
                    <el-option label="日历" value="/calendar"></el-option>
                    <el-option label="待办" value="/todo"></el-option>
                    <el-option label="课表" value="/timetable"></el-option>
                    <el-option label="番茄钟" value="/tomatotimerconfig"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="隐藏课表页">
                <el-switch v-model="userInfoStore.setting.notShowCourseTable"></el-switch>
            </el-form-item>
            <el-form-item label="倒计时结束时打开弹窗通知">
                <el-switch v-model="tomatoTimerStore.tomatoTimerSetting.openOSNotification"></el-switch>
                <span>若无通知提示请检查 系统 -> 通知 -> 请勿打扰/自动启用请勿打扰</span>
            </el-form-item>
            <el-form-item label="倒计时结束时打开声音提示">
                <el-switch v-model="tomatoTimerStore.tomatoTimerSetting.openSoundNotification"></el-switch>
            </el-form-item>
            <el-form-item label="输入待办时显示格式提示">
                <el-switch v-model="todoListStore.setting.showPrompt"></el-switch>
            </el-form-item>
            <el-form-item label="打开软件时自动获取学在浙大待办">
                <el-switch v-model="todoListStore.setting.updateOnLoad"></el-switch>
            </el-form-item>
            
            <el-form-item label="获取待办链接(可导入部分手机和其他设备)">
                <el-button :loading="todoListStore.setting.isGetUrlLoading" @click="getUrlLink()">获取待办链接</el-button>
                <el-input v-model="todoListStore.setting.urlLink"></el-input>
            </el-form-item>
            <el-form-item label="将待办自动同步到服务器">
                <el-switch v-model="todoListStore.setting.openUrlLink"></el-switch>
            </el-form-item>
            <el-form-item label="是否将学在浙大待办加入待办链接">
                <el-switch v-model="todoListStore.setting.addXZZDToUrl"></el-switch>
            </el-form-item>
            <el-divider />
            <div style="margin-top:-10px;">
                关于ZTA
            </div>
            <el-form-item label="当前版本">
                <span style="margin-right: 10px;">0.1.2</span>
                
            </el-form-item>
            <el-form-item >
                <el-button @click="gotoServiceTerms">
                    服务条款
                </el-button>
                <el-button @click="gotoAbout">
                    关于我们
                </el-button>
                <el-button @click="gotoProject">
                    项目地址
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
import { ref, reactive} from 'vue'
import { useUserInfoStore } from '@/stores/userInfoStore';
import { useCourseTableStore } from '@/stores/courseTableStore';
import { useTomatoTimerStore } from '@/stores/tomatoTimerStore';
import { useTodoListStore } from '@/stores/todoListStore';
import { ElMessage } from 'element-plus';
import EventBus from '@/script/eventBus'
import router from '@/router/index'
const todoListStore = useTodoListStore();
const userInfoStore = useUserInfoStore();
const tomatoTimerStore = useTomatoTimerStore();
const courseTableStore = useCourseTableStore();
const logout = () => {
    userInfoStore.logout();
    courseTableStore.$reset();
    ElMessage({
    message: '退出登录成功',
    type: 'success',
  })

}
const login = () => {
    router.push('/login');
}
const getUrlLink = () => {
    if(!userInfoStore.accountInfo.loginStatus){
        ElMessage({
        message: '请先登录',
        type: 'error',
        })
        return;
    }
    todoListStore.setting.openUrlLink = true;
    EventBus.emit('getUrlLink')
}

const gotoServiceTerms = () =>{
    router.push('/service')
}

const gotoAbout = () =>{
    router.push('/about')
}
const gotoProject = () =>{
    window.open('https://github.com/wdtjm/zta')
}
</script>