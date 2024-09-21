<template>
    <div class="login-body">
        <div class="login-panel">
            <div class="login-title">用户登录</div>
            <el-form :model="formData" :rules="rules" ref="formDataRef">
                <el-form-item prop="username">
                    <el-input placeholder="请输入学号" v-model="formData.username" size="large" type="text">
                        <template #prefix>
                            <el-icon>
                                <i-ep-user />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" v-model="formData.password" size="large" type="password"
                        @keyup.enter.native="login()">
                        <template #prefix>
                            <el-icon>
                                <i-ep-lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <!-- <el-form-item label="">
                    <div class="check-code-panel">
                        <el-input placeholder="请输入验证码" v-model="formData.checkCode" class="input-panel" />
                        <img src="checkCodeUrl" class="check-code">
                    </div>
                </el-form-item> -->
                <!-- <el-form-item label="">
                    <el-checkbox label="记住密码" name="type" />
                </el-form-item> -->
                <el-form-item label="">
                    <el-button type="primary" style="width: 100%;" :loading="userInfoStore.accountInfo.isLoading"
                        @click="login()" size="large">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
​
<script setup>
import { ref, reactive, onUnmounted, } from 'vue'
// Element-Plus的依赖采用的是自动导入，所以这里无需显示的引入，其他地方的element-plus引用同理
import { ElMessage } from 'element-plus';
//这里使用自行封装的axios，下文已给出，照搬后修改运行端口即可
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/userInfoStore';
import  EventBus  from '@/script/eventBus';

const userInfoStore = useUserInfoStore();
// const checkCodeUrl = "api/checkCode?" + new Date().getTime();
userInfoStore.accountInfo.isLoading = false;
//表单
let interval = null;
const formDataRef = ref();
let formData = reactive({
    username: "",
    password: ""
});
const rules = {
    username: [{
        required: true,
        message: "请输入学号"
    }],
    password: [{
        required: true,
        message: "请输入密码"
    }],
    // checkCode: [{
    //     required: true,
    //     message: "请输入验证码"
    // }],
}

const router = useRouter();

const login = () => {
    userInfoStore.accountInfo.isLoading = true;
    var form_obj = JSON.parse(JSON.stringify(formData));
    // console.log(form_obj);
    // console.log(form_obj.username);
    // console.log(form_obj.password);
    if (formData.username[0] == '3') {
        userInfoStore.accountInfo.role = '0'
    } else {
        userInfoStore.accountInfo.role = '3'
    }
    let requestInfo = {
        mode: userInfoStore.accountInfo.role,
        account: formData.username,
        password: formData.password,
    }
    interval = setInterval(() => {
        ElMessage({
            message: '登录超时，请检查网络连接或稍后再试',
            type: 'error',
        })
    }, 10000);
    window.electronAPI.request(JSON.stringify(requestInfo)).then(result => {
        result = JSON.parse(result.replace(/True/g, 'true').replace(/False/g, 'false').replace(/\'/g, '"'))
        console.log("login result:", result);
        if (result.status === 'success') {
            ElMessage({
                message: '登录成功',
                type: 'success',
            })
            console.log("login result:", result);
            if (interval) {
                clearInterval(interval);
            }
            if (userInfoStore.accountInfo.role == '0') {
                userInfoStore.setAccountInfo({
                    account: formData.username,
                    password: formData.password,
                    loginStatus: true
                });
            } else {
                userInfoStore.setAccountInfo({
                    account: formData.username,
                    password: formData.password,
                    loginStatus: true,
                    role: userInfoStore.accountInfo.role,
                    token: result.data,
                    tokenExpireTime: new Date().getTime() + 1000 * 60 * 60 * 5 // 5h后过期
                });
                // 设置个5h的计时器，过期后自动重新获取token
                if(userInfoStore.setting.updateTokenTimer){
                    clearTimeout(userInfoStore.setting.updateTokenTimer);
                }
                userInfoStore.setting.updateTokenTimer =  setTimeout(() => {
                EventBus.emit('getYjsToken')
                }, 1000 * 60 * 60 * 5);
            }

            router.push("/calendar");
        } else {
            ElMessage({
                message: result.message,
                type: 'error',
            })
        }
    })
};

onUnmounted(() => {
    if (interval) {
        clearInterval(interval);
    }
})
</script>

<style scoped>
.login-body {

    height: 100%;
    background-size: cover;
    left: 0;
    top: 0;

    .login-panel {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        padding: 25px;
        width: 26%;
        min-width: 460px;
        height: 30%;
        min-height: 300px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 5%;
        box-shadow: 2px 2px 10px #ddd;

        .login-title {
            font-size: 22px;
            text-align: center;
            margin-bottom: 22px;
        }
    }
}
</style>