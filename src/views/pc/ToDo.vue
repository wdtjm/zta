<template>
    <div id="todo" style="position: relative;overflow: hidden;">
        <div class="demo-collapse" id="" style="height: 100%;width: 100%;">
            <el-collapse v-model="activeName">
                <el-collapse-item title="未完成" name="1">
                    <el-checkbox-group v-model="compeletedTodoIdList">
                        <div class="incompeleteTodoList" v-for="todo in todoListStore.incompeleteTodoList"
                            :key="todo.id">
                            <el-checkbox :class="{ 'strike-through': true, 'active': todo.isActive }"
                                :id="String.toString(todo.id)" :label="todo.id" :key="todo.id"
                                @change="addDoneList(todo.id)">
                                {{ todo.isBrief?"": todo.time }} {{ todo.content }}{{ todo.isXZZD ? ' ' + todo.course : '' }}
                                <el-tag size="small" style="margin-left:4px;" effect="plain" v-if="todo.isXZZD" type="primary">xzzd</el-tag>
                                <el-icon class="edit-icon" @click.stop.prevent="editTodo($event, todo)">
                                    <Edit />
                                </el-icon>
                                <el-icon class="delete-icon" @click.stop.prevent="deleteTodo($event, todo.id)">
                                    <Delete />
                                </el-icon>
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template #title>

                        已完成
                        <div class="deleteAll" @click.stop.prevent="clearAllCompeletedTodoList">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            <span>delete all</span>
                        </div>

                    </template>
                    <el-checkbox-group v-model="compeletedTodoIdList">
                        <div class="compeletedTodoList" v-for="todo in todoListStore.compeletedTodoList" :key="todo.id">
                            <el-checkbox :label="todo.id" :key="todo.id" @change="removeDoneList(todo.id)">
                                {{ todo.content }} {{ todo.isBrief?"": todo.time }}
                                <el-tag size="small" style="margin-left:4px;" effect="plain" v-if="todo.isXZZD" type="primary">xzzd</el-tag>
                                <el-icon class="delete-icon" @click.stop.prevent="deleteTodo($event, todo.id)">
                                    <Delete />
                                </el-icon>
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </el-collapse-item>
            </el-collapse>
            <div class="floating-component">
                <!-- 悬浮内容 -->

                <div slot="content" @click="handleAddTodo">
                    <el-button size="large" circle style="height: 60px;width:60px;">
                        <el-icon :size="40">
                            <Edit />
                        </el-icon>
                    </el-button>
                </div>

            </div>
        </div>

    </div>
    <div class="my-drawer">
        <el-drawer v-model="drawer" class="totalDrawer" size="50%" :append-to-body="false" append-to="#todo"
            direction="btt" style="position:absolute !important;">
            <template #header>
                <el-input :autofocus="true" class="input-item" v-model="inputText" style="width: 100%;height:100%;"
                    :rows="2" type="textarea" placeholder="enter提交" @keyup.enter.native="inputComplete()" />
            </template>
            <template #default>
                <div v-if="todoListStore.setting.showPrompt"
                    style="display: flex;flex-direction: row;align-items: flex-start;justify-content: flex-start;height: 100%;">
                    <div style="font-size: small;color: gray !important; margin-left: 30px;">
                        <div>格式：</div>
                        <div>
                            <div>开班会</div>
                            <div>开班会 9.13 13.25 &nbsp; ( 9-13、13：25、13:25均可)</div>
                            <div>开班会 2024 9.13 13.25 &nbsp; (同上)</div>
                        </div>
                    </div>

                </div>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancelClick">取消</el-button>
                    <el-button type="primary" @click="inputComplete()">提交</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { useTodoListStore } from '@/stores/todoListStore';
import { ElMessage } from 'element-plus';
import EventBus from '@/script/eventBus';
const todoListStore = useTodoListStore()
console.log('todoList:', todoListStore.todoList)


const compeletedTodoIdList = ref(todoListStore.compeletedTodoIdList)
const incompeleteTodoIdList = reactive(todoListStore.incompeleteTodoIdList)

const activeName = ref(['1'])
const checkList = ref([])
const drawer = ref(false)
const FalseValue = ref(false)
const inputText = ref('')
const isEdit = ref(false)

const onModifed = () => {
    console.log('onModifed')
    if(todoListStore.setting.openUrlLink){
        EventBus.emit('getUrlLink')
    }
    
}

const addDoneList = (id) => {
    /* console.log('compeletedTodoList',compeletedTodoIdList.value)
    // id不存在时，添加到compeletedTodoIdList中
    if (compeletedTodoIdList.value.indexOf(id) === -1) {
        compeletedTodoIdList.value.push(id)
    } */
    /* console.log('compeletedTodoList add ',id, compeletedTodoIdList.value) */
    todoListStore.toggleActive(id)

    setTimeout(() => {
        
        todoListStore.updateTodoStatus(id)
        todoListStore.toggleActive(id)
        onModifed()
    }, 300)
}
const removeDoneList = (id) => {
    /*  console.log('compeletedTodoList',compeletedTodoIdList.value)
     // id存在时，从compeletedTodoIdList中移除
 
     if (compeletedTodoIdList.value.indexOf(id) !== -1) {
         compeletedTodoIdList.value.splice(compeletedTodoIdList.value.indexOf(id), 1)
     }
     compeletedTodoIdList.value.splice(compeletedTodoIdList.value.indexOf(id), 1) */
    console.log('compeletedTodoList remove ', id, compeletedTodoIdList.value)
    todoListStore.updateTodoStatus(id)
    onModifed()
}
const formatDate = function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

const match123 = (match, divisor, isXZZD = false) => {
    const event = match[1].trim();
    const date = match[2];
    const time = match[3];
    const [month, day] = date.split('.').map(Number);
    //console.log('event:', event, 'date:', date, 'time:', time,'after split:',date.split(divisor))
    const [hour, minute] = time.split(divisor).map(Number);
    const eventDate = new Date();
    eventDate.setMonth(month - 1); // 月份是从0开始的
    eventDate.setDate(day);
    eventDate.setHours(hour);
    eventDate.setMinutes(minute);
    eventDate.setSeconds(0);
    eventDate.setMilliseconds(0);
    return { content: event, time: formatDate(eventDate), isXZZD: isXZZD }
}

const inputComplete = () => {
    /*     <div>开班会</div>
        <div>开班会 9.13 13.25</div>
        <div>开班会 9.13 13:25</div>
        <div>开班会 2024 9.13 13.25</div> */
    const regex = /(\S+)\s(\d{4})?\s?(\d{1,2})[.-](\d{1,2})\s(\d{1,2})[.:：](\d{2})/;

    let match = inputText.value.match(regex);
    if (match) {
        console.log('match:', match,'length:', match.length)
        // 偏移量
        let offset = 0
        const eventDate = new Date();
        if(match[2]){
            // 格式：开班会 2024 9.13 13.25
            
            eventDate.setFullYear(Number(match[2]));
            offset = 1
        }else{
            // 格式：开班会 9.13 13.25
            eventDate.setFullYear(todoListStore.setting.defaultYear);
            offset = 1
        }
        const event = match[1]
        const month = Number(match[2 + offset])
        const day = Number(match[3 + offset])
        const hour = Number(match[4 + offset])
        const minute = Number(match[5 + offset])
        eventDate.setMonth(month - 1); // 月份是从0开始的
        eventDate.setDate(day);
        eventDate.setHours(hour);
        eventDate.setMinutes(minute);
        eventDate.setSeconds(0);
        eventDate.setMilliseconds(0);
        todoListStore.addTodo({ content: event, time: formatDate(eventDate), isXZZD: false }) 
        onModifed()
    } else {
        /* ElMessage({
            type: 'error',
            message: '格式不正确'
        }) */

       todoListStore.addTodo({content: inputText.value, time: "2000-01-01 00:00:00", isBrief: true})
       onModifed()
    }
    console.log(inputText.value)
    inputText.value = ''

}


onMounted(() => {

})

const editTodo = (event, todo) => {
    event.stopPropagation()
    drawer.value = true
    const date = new Date(todo.time)
    inputText.value = todo.content + ' ' + (date.getMonth() + 1) + '.' + date.getDate() + " " + date.getHours() + "." + String(date.getMinutes()).padStart(2, '0')
    todoListStore.deleteTodoById(todo.id)
    console.log('editTodo', todo.id)
    onModifed()
}

const deleteTodo = (event, id) => {
    event.stopPropagation()
    todoListStore.deleteTodoById(id)
    console.log('deleteTodo', id)
    onModifed()
}

function cancelClick() {
    drawer.value = false
}
function confirmClick() {
    ElMessageBox.confirm(`Are you confir?`)
        .then(() => {
            drawer.value = false
        })
        .catch(() => {
            // catch error
        })
}
function handleAddTodo() {
    drawer.value = !drawer.value
}
const clearAllCompeletedTodoList = () => {
    todoListStore.clearAllCompeletedTodoList()
}

</script>

<style scoped lang="less">

.floating-component {
    position: fixed;
    /* 固定位置 */
    bottom: 13%;
    /* 下边距 */
    right: calc(50% - 30px);
    /* 右边距 */
    padding: 0;
    border-radius: 50%;
    /* 圆角 */
    z-index: 100;
    /* 设置 z-index 确保悬浮在顶层 */
}

.strike-through::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    /* 横线的粗细 */
    background-color: rgb(0, 51, 255);
    /* 横线的颜色 */
    transform: scaleX(0);
    transform-origin: left;
    animation: strike 0.3s forwards;
    /* 动画持续时间 */
    display: none;
}

.strike-through.active::after {
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

.is-done {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    /* 横线的粗细 */
    background-color: red;
    /* 横线的颜色 */
    transform: scaleX(0);
    transform-origin: left;
    animation: strike 0.3s forwards;
    /* 动画持续时间 */
}

.incompeleteTodoList {
    :deep .el-checkbox .el-checkbox__label {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

    }

    transition: all 0.3s ease;
    margin-left:20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}

.incompeleteTodoList:hover {
    background-color: #f5f5f5;

    .edit-icon {
        display: block;
    }

    .delete-icon {
        display: block;
    }
}

.edit-icon {
    display: none;
    font-size: 18px;
    margin-left: 10px;
}

.edit-icon:hover {
    color: #1890ff;
    cursor: pointer;
}

.delete-icon {
    display: none;
    font-size: 18px;
    margin-left: 10px;
}

.delete-icon:hover {
    color: #1890ff;
    cursor: pointer;
}

.compeletedTodoList {
    transition: all 0.3s ease;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-left: 20px;

    :deep .el-checkbox .el-checkbox__label {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

    }

    :deep .is-checked {
        --el-checkbox-checked-bg-color: #7f7f7f;

        .el-checkbox__label {
            color: #7f7f7f;
            --el-checkbox-checked-bg-color: #7f7f7f;
        }
    }
}

.compeletedTodoList:hover {
    background-color: #f5f5f5;

    .delete-icon {
        display: block;
    }
}

.but {
    font-size: larger;
    color: rgb(0, 119, 216);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    /* 阴影 */
}

.butto {
    border: 0;
    padding: 10px;
    margin: 0;
}

.too.el-tooltip__popper.is-light {
    border: none !important;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    padding: 5px
}

/* 修改箭头边框 这里方位是left，所以 x-placement^="left" 并且是设置 border-right-color 的颜色*/
.too.el-tooltip__popper.is-light[x-placement^="left"] .popper__arrow {
    border-left-color: #eaeaea !important;
}

.too.el-tooltip__popper[x-placement^="left"] .popper__arrow {
    border-left-color: #eaeaea !important;
}

.my-drawer {
    :deep .el-overlay {
        position: absolute;
    }
}

#todo {
    height: 100%;
    width: 100%;

    :deep .el-overlay {

        position: absolute !important;
        background-color: transparent !important;

        .el-drawer {
            box-shadow: none;
            border-top: 1px solid hsla(0, 0%, 87%, 1);
        }
    }
}

.input-item {
    :deep .el-textarea__inner {
        outline: none !important;
        box-shadow: none !important;
        border: none !important;
    }
}

.deleteAll {
    position: relative;
    left: 6%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

}

.deleteAll:hover {
    cursor: pointer;
    color: #1890ff;
}

.totalDrawer {
    :deep .el-drawer__body {
        padding: 0;
    }
}
</style>