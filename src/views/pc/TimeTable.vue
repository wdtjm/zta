<template>
    <div class="timetable w100 " v-if="this.show" v-loading="courseTableTest.isLoading">
        <div class="time-b w100">
            <div class="time-detail">
                <div style="display: flex; justify-content: flex-start; align-items: center;flex-direction: row;">
                    <el-button style="margin:10px;" @click="subYear()" :disabled="tabelStore.isMinYear" ><</el-button>
                    <div> {{ courseTableSetting.year }}-{{String(parseInt(courseTableSetting.year) + 1)}}</div>
                    <el-button style="margin:10px;" @click="addYear()" :disabled="tabelStore.isMaxYear" >></el-button>
                    </div>
                <el-radio-group style="margin:10px;" v-model="courseTableSetting.term" @change="changeTabel">
                    <el-radio value="fall" size="large">秋</el-radio>
                    <el-radio value="winter" size="large">冬</el-radio>
                </el-radio-group>
                <el-radio-group style="margin:10px;" v-model="courseTableSetting.mode" @change="changeTabel">
                    <el-radio value="0" size="large">单</el-radio>
                    <el-radio value="1" size="large">双</el-radio>
                </el-radio-group>
                <span class="last-update">上次更新: {{lastUpdate}}</span>
                <el-button :icon="Refresh" @click="refreshTable()" round >
                    <el-icon>
                        <Refresh />
                    </el-icon>
                </el-button>
            </div>
            <!-- <div class="time-controller">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-arrow-left"
                        @click="changeCount(1), getWeek(count)"></el-button>
                    <el-button round class="date-btn">本周</el-button>
                    <el-button type="primary" icon="el-icon-arrow-right"
                        @click="changeCount(-1), getWeek(count)"></el-button>
                </el-button-group>
            </div> -->
        </div>
        <div class="timetable-b w100">
            <table class="timetable-content w100">
                <thead>
                    <tr>
                        <th></th>
                        <!-- <th>周一</th>
                            <th>周二</th>
                            <th>周三</th>
                            <th>周四</th>
                            <th>周五</th>
                            <th>周六</th>
                            <th>周日</th> -->
                        <th v-for="(item1, index1) in weeks" :key="index1">
                            {{ "周" + numberToChinease(item1, "week") }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item2, index2) in 13" :key="index2">
                        <td>
                            <p>{{ "第" + numberToChinease(item2) + "节" }}</p>
                        </td>
                        <template v-for="(item3, index3) in weeks" :key="index3" :style="[{
                                        height: getCourse(index3, index2).num * 30 + 'px',
                                    }]">
                            <td v-if="(getCourse(index3, index2) != 'occupied')"
                                :rowspan="getCourse(index3, index2).num" :style="[{
                                    height: getCourse(index3, index2).num * 30 + 'px',
                                    overflow: 'hidden',
                                }]">
                                <div class="dmsjandjs-b" :style="[
                                    {
                                        height: getCourse(index3, index2).num * 30 + 'px',
                                    }
                                    ,
                                    {
                                        background: getCourse(index3, index2).index
                                            ? getRandomColor()
                                            : '#FFFFFF',
                                    },
                                    { color: '#fff' },
                                    { borderRadius: '15px' },
                                    { padding: '12px' },

                                ]">
                                    <p>
                                        {{ getCourse(index3, index2).startTime }}
                                        {{ getCourse(index3, index2).startTime ? "-" : "" }}
                                        {{ getCourse(index3, index2).endTime }}
                                    </p>
                                    <p>{{ getCourse(index3, index2).courseName }}</p>
                                </div>
                                <!-- <div class="detail">

                                </div> -->
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>

</script>

<script>
import moment from "moment";
import { weekCourse, colorList } from "../../script/timeTable.js";
import { getCurrentInstance } from 'vue';
import { useCourseTableStore } from '@/stores/courseTableStore';
import { useRouter } from 'vue-router';
import router from '../../router/index.js'
import { ElMessage } from "element-plus";
import { useUserInfoStore } from "@/stores/userInfoStore.js";
import EventBus from "@/script/eventBus.js";
import { Refresh } from "@element-plus/icons-vue";

export default {
    components:{
        Refresh
    }
    ,
    setup() {
        const TableStore = useCourseTableStore();
        const userInfoStore = useUserInfoStore();
        const refreshTable=()=>{
            if(userInfoStore.accountInfo.loginStatus != true){
                ElMessage.error("请先登录");
                router.push('/login');
            }else{
                EventBus.emit('updateCourseTable')
            }
        };
        return {
            userInfoStore,
            refreshTable,
            courseTableTest: TableStore.courseTableSetting,
            setLoading: TableStore.setLoading,
            tabelStore: TableStore,
        }
    },
    watch: {
        'courseTableTest.isLoading': (newValue, oldValue) => {
            if (newValue === false && oldValue === true) {
                console.log('router path', router.currentRoute.value.path)
                if (router.currentRoute.value.path === '/timetable') {
                    router.go(0)
                }
            }
        }
    },
    data() {
        return {
            startTime: "2022.10.17",
            endTime: "2022.10.23",
            colorList: [], //随机颜色
            weekCourse: [], // 课程详细课程、数量
            weeks: [], //头部周期
            maxCourseLength: 0, //最大课节数,
            count: 0, //上周、下周、本周选择器flag
            courseTableSetting: {
                year: "2024",
                lastUpdate: "",
                mode: "single",//single or double
                term: "fall",//spring,summer,fall,winter
                isLoading: false
            }, //课程表设置
            proxy: getCurrentInstance().proxy,
            show: true,
            lastUpdate: "",
        };
    },
    created() {
        // 检查是否登录
        const userInfoStore = useUserInfoStore();
        if (userInfoStore.accountInfo.loginStatus != true) {
            ElMessage.error("请先登录");
            router.push('/login');
        } else {
            const courseTableStore = useCourseTableStore();
            this.courseTableSetting = courseTableStore.courseTableSetting;

            const year = courseTableStore.courseTableSetting.year;
            const term = courseTableStore.courseTableSetting.term;
            this.lastUpdate = courseTableStore.courseTable[year][term].lastUpdate;
            if(this.lastUpdate == null || this.lastUpdate == ""){
                this.lastUpdate = "暂无"
            }else{
                this.lastUpdate = moment(this.lastUpdate).format("YYYY-MM-DD HH:mm:ss")
            }
            if(userInfoStore.accountInfo.role == "0")//本科生
            {
                // TODO: lastUpdateTime 为“”时，需要重新获取数据
                //console.log('lastupdate time before:',courseTableStore.courseTable[year][term].lastUpdate)
                this.weekCourse = JSON.parse(JSON.stringify(courseTableStore.courseTable[year][term].data))
                //console.log('lastUpdate time:',this.lastUpdate)
            }else{
                this.weekCourse = JSON.parse(JSON.stringify(courseTableStore.getYjsCourseTable))
                //console.log('lastUpdate time:',this.lastUpdate)
            }
            
            console.log('this.$courseTable.fall.courses', this.weekCourse);
            if (this.weekCourse == null || this.weekCourse.length === 0) {
                ElMessage.error("课程表数据为空，正在获取中");
                EventBus.emit('updateCourseTable')
            } else {
                this.filterSingleOrDouble();
                this.colorList = colorList;
                console.log('before sort:',this.weekCourse)
                this.sortData();
                console.log('after sort:',this.weekCourse)
                this.init();
                this.getWeek(0);
                console.log('weeks:', this.weeks);
                console.log('maxCourseLength:', this.maxCourseLength);
                console.log('weekCourse:', this.weekCourse);
                console.log('this.getCourse(0,0)', this.getCourse(0, 0))
                console.log('0 0 ', this.weekCourse[0].courses[0]);
                console.log('0 1 ', this.weekCourse[0].courses[1]);
                // this.courseTableSetting.isLoading = false;
            }
        }



    },
    computed: {
        shouldDisplay(weekIndex, courseIndex) {

            return (weekIndex, courseIndex) => {
                let res1 = !(this.getCourse(weekIndex, courseIndex - 1).index + this.getCourse(weekIndex, courseIndex - 1).num - 1 >= courseIndex + 1)

                if (courseIndex > 0) {
                    if (courseIndex > 1) {
                        courseIndex = courseIndex - 1;
                        return res1 && !(this.getCourse(weekIndex, courseIndex - 1).index + this.getCourse(weekIndex, courseIndex - 1).num - 2 >= courseIndex + 1)
                    } else {
                        return res1;
                    }
                } else {
                    return true;
                }

            };
        }
    },
    methods: {
        //改变选择器次数
        changeCount(i) {
            this.count += i;
            return this.count;
        },
        changeTabel() {
            const courseTableStore = useCourseTableStore();
            if(this.courseTableSetting.term == "fall"){
                this.courseTableSetting.xq = "1"
            }else{
                if(this.courseTableSetting.term == "winter"){
                    this.courseTableSetting.xq = "2"
                }
            }
            courseTableStore.setCourseTableSetting(this.courseTableSetting);
            console.log('update courseTableSetting', this.courseTableSetting)
            console.log('after update courseTableSetting', courseTableStore.courseTableSetting)
            // 使用 router.go(0) 刷新当前路由
            //const router = useRouter();
            //router.go(0)
            //router.replace({ path: router.currentRoute.value.path });
            // 检查是否登录
        const userInfoStore = useUserInfoStore();
        if (userInfoStore.accountInfo.loginStatus != true) {
            ElMessage.error("请先登录");
            router.push('/login');
        } else {
            const courseTableStore = useCourseTableStore();
            this.courseTableSetting = courseTableStore.courseTableSetting;

            const year = courseTableStore.courseTableSetting.year;
            const term = courseTableStore.courseTableSetting.term;
            if(userInfoStore.accountInfo.role == "0")//本科生
            {
                this.weekCourse = JSON.parse(JSON.stringify(courseTableStore.courseTable[year][term].data))
            }else{
                this.weekCourse = JSON.parse(JSON.stringify(courseTableStore.getYjsCourseTable))
            }
            
            console.log('this.$courseTable.fall.courses', this.weekCourse);
            if (this.weekCourse == null || this.weekCourse.length === 0) {
                ElMessage.error("课程表数据为空，正在获取中");
                EventBus.emit('updateCourseTable')
            } else {
                this.filterSingleOrDouble();
                this.colorList = colorList;
                console.log('before sort:',this.weekCourse)
                this.sortData();
                console.log('after sort:',this.weekCourse)
                this.init();
                this.getWeek(0);
                console.log('weeks:', this.weeks);
                console.log('maxCourseLength:', this.maxCourseLength);
                console.log('weekCourse:', this.weekCourse);
                console.log('this.getCourse(0,0)', this.getCourse(0, 0))
                console.log('0 0 ', this.weekCourse[0].courses[0]);
                console.log('0 1 ', this.weekCourse[0].courses[1]);
                // this.courseTableSetting.isLoading = false;
            }
            this.show = false;
            this.$nextTick(() => {
                this.show = true;
            })
        }

        },
        // 排序周期和课数
        sortData() {
            //周期
            this.weekCourse.sort((a, b) => {
                return a.week - b.week;
            });
            this.weekCourse.forEach((item) => {
                for (const key in item) {
                    if (key === "courses") {
                        item[key].sort((a, b) => {
                            return a.index - b.index;
                        });
                    }
                }
            });
        },
        filterSingleOrDouble() {
            for (let i = 0; i < 7; i++) {
                {
                    this.weekCourse[i].courses = this.weekCourse[i].courses.filter((item) => {
                        return item.mode == this.courseTableSetting.mode || item.mode == 2;
                    })
                }
            }
        },
        // 初始化课数(courses)与天数(week)
        init() {
            this.weeks = []; //周集合
            this.maxCourseLength = 0;
            this.weeks = this.weekCourse.map((item, index) => {
                for (const key in item) {
                    if (key === "courses") {
                        console.log(item[key]);
                        for (let j = 0; j < item[key].length; j++) {
                            if (item[key][j] && item[key][j + 1] && item[key][j].courseName === item[key][j + 1].courseName) {
                                item[key][j].num = parseInt(item[key][j].num) + parseInt(item[key][j + 1].num);
                                item[key][j].endTime = item[key][j + 1].endTime;
                                item[key].splice(j + 1, 1);
                                j = j - 1;
                            }
                        }
                        console.log(item[key]);

                        let max = 0; //
                        //取出一周中最大的课节数及当天的最大课节数
                        for (let j of item[key]) {
                            j.index > this.maxCourseLength &&
                                (this.maxCourseLength = j.index); //取所有一周里最大课节值
                            j.index > max && (max = j.index); //取当天最大课节值
                        }
                        // console.log("max:", max);

                        //如果当天的课节总数小于当天的最大课节值
     
                            //以最大课节值为终点遍历当天课节
                            for (let i = 0; i < 13; i++) {
                                //如果下标课节不存在或着与循环的下标不匹配
                                if (!item[key][i] || item[key][i].index != i + 1) {
                                    item[key].splice(i, 0, " "); //填充空课节
                                }
                            }
                            for (let j = 0; j < item[key].length; j++) {
                                if (item[key][j] != " ") {
                                    if (item[key][j].num > 1) {
                                        for (let k = 1; k < item[key][j].num; k++) {
                                            item[key][j + k] = "occupied";
                                        }
                                    }
                                }
                            }

                        
                    }
                }
                return item.week;
            });
        },

        /**
         * 处理数据
         * @param { Number } weekIndex 周几对应的下标-1
         * @param { Number }  courseNum  第几节课对应的下标-1
         * @returns { String }   返回对应字符
         */
        getCourse(weekIndex, courseNum) {
            if (
                this.weekCourse[weekIndex] &&
                this.weekCourse[weekIndex].courses[courseNum]
            ) {
                // this.getRandomColor();
                return this.weekCourse[weekIndex].courses[courseNum];
            } else {
                return false;
            }

        },

        /**
         * 数字转中文
         * @param { Number } n 需转换的数字
         * @param { Boolean }  identifier  标识符
         * @returns { String }  identifier  转换后的中文
         */
        numberToChinease(n, identifier) {
            const chnArr = [
                "零",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六",
                "七",
                "八",
                "九",
                "十",
                "十一",
                "十二",
                "十三"
            ];
            return identifier === "week" && (n === 0 || n === 7) ? "日" : chnArr[n];
        },

        //随机获取颜色
        getRandomColor() {
            let colorList = this.colorList;
            let colorRandom = Math.floor(Math.random() * colorList.length + 1) - 1;
            let color;
            for (let i = 0; colorList.length > i; i++) {
                if (i == colorRandom) {
                    color = colorList[i];
                }
            }
            return color;
        },

        //随机上、本、下周 日期
        getWeek(i) {
            let weekOfDay = parseInt(moment().format("E")); //计算今天是这周第几天
            let last_monday = moment()
                .subtract(weekOfDay + 7 * i - 1, "days")
                .format("YYYY-MM-DD"); //周一日期
            let last_sunday = moment()
                .subtract(weekOfDay + 7 * (i - 1), "days")
                .format("YYYY-MM-DD"); //周日日期
            this.startTime = last_monday;
            this.endTime = last_sunday;
        },
        subYear(){
            this.courseTableSetting.year = String(parseInt(this.courseTableSetting.year) - 1);
            this.changeTabel();
        },
        addYear(){
            this.courseTableSetting.year = String(parseInt(this.courseTableSetting.year) + 1);
            this.changeTabel();
        }
    }
};

</script>

<style scoped lang="scss">
.timetable {
    background-color: #f1f7ff;

    .w100 {
        width: 100% !important;
    }

    .h100 {
        height: 100% !important;
    }

    .time-b {
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .time-detail {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            color: #333333;
            font-weight: 700;
            font-size: 20px;
            font-family: "Microsoft YaHei";
        }
    }

    .timetable-b {
        height: 500px;
        background-color: #fff;
        overflow: auto;

        .timetable-content {
            height: 100%;
            table-layout: fixed;
            border-collapse: collapse; //设置表格的边框是否被合并为一个单一的边框
            text-align: center;
            color: #333333;
            font-weight: 300;
            font-size: 12px;

            thead {
                height: 40px;

                th {
                    border: 2px solid rgba(27, 100, 240, 0.1);
                }
            }

            tbody {

                tr {
                    height: 30px;
                }

                td {
                    padding: 4px;
                    border: 2px solid rgba(27, 100, 240, 0.1);

                    .dmsjandjs-b {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                }
            }
        }
    }
}

::v-deep {
    .time-controller {
        .el-button-group {
            .el-button {
                height: 46px;
                background: #ffffff;
                font-size: 18px;
                font-weight: 600;
                border: 1px solid rgba(27, 100, 240, 0.1);
                border-radius: 55px;
                color: #1b64f0;
            }

            :nth-child(2) {
                margin: 0px 12px;
            }
        }
    }
}
.last-update{
    margin-left:10px;
    font-size: small;
    margin-right: 10px;
    color:#333333;
}
</style>