<template>

    <div class="about">
        <div class="title">

            <el-button class="close-btn" :icon="Close" @click="router.back()"></el-button>
            <span>关于我们</span>
        </div>
        <div class="content">
            <el-form>
                <el-form-item label="developer:">
                    <el-avatar size="small" :src="wdtjm" />
                    <span>无敌太寂寞</span>
                </el-form-item>
                <el-form-item label="contributor:">
                    <div class="row-center">
                        <el-avatar size="small" :src="snowdream" />
                        <span>SnowDream39</span>
                    </div>
                    <div class="row-center">
                        <el-avatar size="small" :src="ly" />
                        <span>lySpartan117</span>
                    </div>
                    <div class="row-center">
                        <el-avatar size="small" :src="zyt" />
                        <span>ZZZYYYT3</span>
                    </div>
                </el-form-item>
                <el-form-item label="来源:">
                    浙江大学信电学院sqtp项目
                </el-form-item>
                <el-form-item label="团队:">
                    浙江大学学生视窗技术俱乐部
                </el-form-item>
                <el-form-item label="意见反馈:">
                    3220104331@zju.edu.cn
                </el-form-item>
                <el-form-item label="社团公众号:">
                    <img height="100px" :src="gzh">
                    <span>(欢迎加入我们)</span>
                </el-form-item>
            </el-form>
           
                <!-- <div>
                <el-avatar src="@/assets/avatar/wdtjm.jpg" />
                <span>无敌太寂寞</span>
            </div> -->
            
        </div>
    </div>

</template>

<script setup>
import { Close } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router'
import wdtjm from '../../assets/avatar/wdtjm.jpg'
import snowdream from '../../assets/avatar/snowdream.jpg'
import ly from '../../assets/avatar/ly.jpg'
import gzh from '../../assets/avatar/公众号二维码.jpg'
import zyt from '../../assets/avatar/zyt.jpg'

const router = useRouter()

</script>

<style scoped>
.about {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.title {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 50px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e4e4e4;
    padding: 0 20px;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 20px;
    color: #909399;
    cursor: pointer;
}

.content {
    padding: 20px;
    text-align: justify;
}
.row-center{
    margin: 7px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.column-center{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>