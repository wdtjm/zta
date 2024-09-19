<template>

    <div class="service-term">
        <div class="title">

            <el-button class="close-btn" :icon="Close" @click="router.back()"></el-button>
            <span>服务条款</span>
        </div>
        <div class="content">
            <p>欢迎使用本软件！本软件基于Gplv3协议开源</p>
            <p>免责声明：在适用的法律范围内，该程序不提供任何质量保证。除非另有书面说明，版权持有者和程序提供者应按照原样提供程序，并且不提供任何明示或者暗示的保证，包括但不限于适销性和特定用途适用性的暗示保证。使用该程序所产生的全部风险，比如程序的质量和性能问题，全部由你承担。如果程序出现缺陷，你将承担所有必要的修复和更正服务带来的损失。
            </p>
            <p>责任限制：除非有适用法律或书面协议要求，任何版权持有者，或该程序按照本协议可能存在的第三方修改和再发布者，都不对你的损失负有责任，包括由于使用或者不能使用该程序造成的任何一般的、特殊的、偶发的或重大的损失（包括但不限于数据丢失、数据失真、你或第三方的后续损失、该程序无法和其他程序协同工作等），即使他们声称会对此负责。</p>

        </div>
    </div>

</template>

<script setup>
import { Close } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<style scoped>
.service-term {
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
</style>