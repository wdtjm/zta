<template>
    <div class="common-layout">
        <h5 class="mb-2">zjuer's time assistant 0.1.1</h5>
        <el-container class="main-container">

            <el-aside style="overflow: hidden; height: auto; width: auto;">
                <el-row class="tac">
                    <el-menu  :default-active="route.path" class="el-menu-vertical-demo"
                        @open="handleOpen" @close="handleClose">
                        <RouterLink to="/calendar">
                            <el-menu-item index="/calendar">
                                <el-icon>
                                    <Calendar />
                                </el-icon>
                                <span>日历</span>
                            </el-menu-item>
                        </RouterLink>

                        <RouterLink to="/timetable" v-if="!userInfoStore.setting.notShowCourseTable">
                            <el-menu-item  index="/timetable">
                                <el-icon>
                                    <Calendar />
                                </el-icon>
                                <span>课表</span>
                            </el-menu-item>
                        </RouterLink>

                        <RouterLink to="/todo">
                            <el-menu-item index="/todo">
                                <el-icon>
                                    <document />
                                </el-icon>
                                <span>待办</span>
                            </el-menu-item>
                        </RouterLink>

                        <RouterLink :to="tomatoTimerStore.tomatoTimerSetting.isStart ? '/tomatotimerstart':'/tomatotimerconfig'">
                            <el-menu-item :index="tomatoTimerStore.tomatoTimerSetting.isStart ? '/tomatotimerstart':'/tomatotimerconfig'">
                                <el-icon>
                                    <clock />
                                </el-icon>
                                <span>番茄钟</span>
                            </el-menu-item>
                        </RouterLink>

                        <RouterLink to="/setting">
                            <el-menu-item index="/setting">
                                <el-icon>
                                    <setting />
                                </el-icon>
                                <span>设置</span>
                            </el-menu-item>
                        </RouterLink>
                    </el-menu>

                </el-row>
            </el-aside>
            <el-main >
               
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import EventBus from '@/script/eventBus'
import { ref } from 'vue';
import { onMounted, onUnmounted } from 'vue';
import { Calendar } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useTomatoTimerStore } from '@/stores/tomatoTimerStore';
import { useUserInfoStore } from '@/stores/userInfoStore';
const tomatoTimerStore = useTomatoTimerStore();
const userInfoStore = useUserInfoStore();
const route = useRouter();

onMounted(() => {
    route.push(userInfoStore.setting.defaultPage)
})
onUnmounted(() => {
    
})

</script>

<script>


export default {

    data() {
        return {

        };
    },
    /* watch: {
        $route(to) {
            // 根据路由路径更新 activeIndex
            if (to.path === '/calendar') {
                activeIndex.value = '1'
            } else if (to.path === '/timetable') {
                activeIndex.value = '2'
            }
        }
    }, */
    created() {
    /*     const that = this
        // 监听登录事件

        // 监听路由变化
        router.afterEach((to) => {
            if (to.path === '/calendar') {
                this.activeIndex = '1';
            } else if (to.path === '/timetable') {
                this.activeIndex = '2';
            }
        }); */
    },

}
</script>
<style scoped>
.common-layout {
    height: 100%;
    width: 92vw;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
}
a:hover{
    background-color: transparent !important;
}
</style>