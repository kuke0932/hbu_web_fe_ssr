<template>
  <div id="timerTable">
    <div class="header">
      <mt-button  slot="right" class="headerBtn" @click="chooseWeek">【{{schoolYear + '-' + '第' + schoolTerm + '学期'}}】第{{week}}周
        <img src="../../assets/icon/down.svg" style=" width:1.3rem;vertical-align: sub" alt="">
      </mt-button>
    </div>
    <table class="table_header">
      <tbody>
        <tr>
          <th style="width: 30px;">{{currentMonth}} <p>月</p></th>
          <th :class="{today: currentWeek[0].today}">周一 <p>{{currentWeek[0].date}}日</p></th>
          <th :class="{today: currentWeek[1].today}">周二 <p>{{currentWeek[1].date}}日</p></th>
          <th :class="{today: currentWeek[2].today}">周三 <p>{{currentWeek[2].date}}日</p></th>
          <th :class="{today: currentWeek[3].today}">周四 <p>{{currentWeek[3].date}}日</p></th>
          <th :class="{today: currentWeek[4].today}">周五 <p>{{currentWeek[4].date}}日</p></th>
          <th :class="{today: currentWeek[5].today}">周六 <p>{{currentWeek[5].date}}日</p></th>
          <th :class="{today: currentWeek[6].today}">周日 <p>{{currentWeek[6].date}}日</p></th>
        </tr>
      </tbody>
    </table>
    <div >
      <table width="100%" class="table_body" cellspacing="4" :style="'height:' + trHeight + 'px'">
        <tbody>
          <tr v-for="(row, i) in tableSheet" :key="i" >
            <td>{{(i+1)}}</td>
            <td class="tdItem" v-for="(column, j) in row" :key="j" :rowspan="column && getRowspan(column.jc)">
              {{column && ( column.courseName + '【' + column.classroomName + '】' + '(' + column.teacherName + ')') + '(' + column.rsjsz +')'}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <mt-popup v-model="popupVisible" position="bottom" style="width: 100%;">
      <div class="confirm_cancel">
        <span  @click="cancel">取消</span>
        <span @click="ensure">确定</span>
      </div>
      <mt-picker style="clear: both" :slots="weeks" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { listCurriculumSchedule, getFirstWeekDate } from '@/api/educational'

export default {
  name: 'timetable',
  head () {
    return {
      title: '课程表'
    }
  },
  data () {
    const curriculumSchedule = new Array(12)
    for (let i = 0; i < curriculumSchedule.length; i++) {
      curriculumSchedule[i] = new Array(7)
    }
    return {
      trHeight: 580,
      tableSheet: curriculumSchedule,
      week: 1,
      schoolYear: '',
      schoolTerm: '',
      popupVisible: false,
      selectedWeek: '',
      // 开学日期为2018/09/03
      beginDate: new Date(2018, 7, 3),
      weeks:
        [
          {
            flex: 1,
            divider: true,
            content: '第',
            className: 'slot1'
          },
          {
            flex: 1,
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
            textAlign: 'center',
            className: 'slot2',
            defaultIndex: 0
          },
          {
            flex: 1,
            divider: true,
            content: '周',
            className: 'slot3'
          }
        ],
      currentWeek: [{}, {}, {}, {}, {}, {}, {}],
      currentMonth: '',
      bgColor: [
        'rgba(52, 152, 219, 0.9)',
        'rgba(243, 188, 51, 0.9)',
        'rgba(219, 113, 100, 0.9)',
        'rgba(137, 196, 125, 0.9)',
        'rgba(185, 144, 219, 0.9)'
      ],
      token: ''
    }
  },
  created () {
  },
  mounted () {
    this.trHeight = window.screen.height - 80
    this.token = this.$route.query.token
    window.sessionStorage.setItem('x-auth-token', this.token)
    this.calcSchoolYearAndTerm()
    getFirstWeekDate(this.schoolYear, this.schoolTerm).then(resp => {
      const date = resp.data
      this.beginDate = new Date(date.substring(0, 4), date.substring(4, 6) - 1, date.substring(6, 8))
      this.week = Math.ceil((new Date().getTime() - this.beginDate.getTime()) / (24 * 3600 * 1000) / 7) || 1
      const weeks1 = this.weeks[1]
      weeks1.defaultIndex = this.week - 1
      this.$set(this.weeks, 1, weeks1)
      const ratio = this.week - 1
      this.getCurrentWeek((1 + (ratio * 7)), (8 + (ratio * 7)))
      // 获取数据
      this.fetchData()
    })
  },
  updated () {
    document.querySelectorAll('.tdItem').forEach(e => {
      if (e.innerText === '') {
        e.style.backgroundColor = ''
        // e.style.boxShadow = ''
      } else {
        e.style.backgroundColor = this.bgColor[(Math.floor(Math.random() * 5))]
        e.style.borderRadius = '4px'
        // e.style.boxShadow = '5px 0px 5px 0px #ccc'
      }
    })
  },
  methods: {
    fetchData () {
      listCurriculumSchedule(this.schoolYear, this.schoolTerm, this.week).then(resp => {
        const respData = resp.data
        const curriculumSchedule = new Array(12)
        for (let i = 0; i < curriculumSchedule.length; i++) {
          curriculumSchedule[i] = new Array(7)
        }
        this.tableSheet = curriculumSchedule
        respData.forEach((e, i) => {
          const col = parseInt(e.jc.substr(0, 1))
          const r = this.tableSheet[col - 1]
          r[e.weekDay - 1] = e
          if (this.getRowspan(e.jc) === 2) {
            this.tableSheet[col].splice([e.weekDay - 1], 1)
          }
          if (this.getRowspan(e.jc) === 3) {
            this.tableSheet[col].splice([e.weekDay - 1], 1)
            this.tableSheet[col + 1].splice([e.weekDay - 1], 1)
          }
          if (this.getRowspan(e.jc) === 4) {
            this.tableSheet[col].splice([e.weekDay - 1], 1)
            this.tableSheet[col + 1].splice([e.weekDay - 1], 1)
            this.tableSheet[col + 2].splice([e.weekDay - 1], 1)
          }
          this.$set(this.tableSheet, col - 1, r)
        })
      })
    },
    getRowspan (str) {
      return str.substring(2) - str.substr(0, 1) || ''
    },
    chooseWeek () {
      this.popupVisible = true
    },
    onValuesChange (picker, values) {
      this.selectedWeek = values[0]
    },
    ensure () {
      const ratio = this.selectedWeek - 1
      this.getCurrentWeek((1 + (ratio * 7)), (8 + (ratio * 7)))
      this.popupVisible = false
      this.week = this.selectedWeek
      this.fetchData()
    },
    cancel () {
      this.popupVisible = false
    },
    // 获取当前一周
    getCurrentWeek (weekBeginOffset, weekEndOffset) {
      let beginDate = this.beginDate
      const oneDayTime = 60 * 60 * 24 * 1000
      let beginNow = beginDate.getTime()
      let day = beginDate.getDay() // 星期
      let arr = []
      // 本周第一天所在的月份
      this.currentMonth = new Date(beginNow - (1 - weekBeginOffset) * oneDayTime).getMonth() + 1
      for (let i = weekBeginOffset; i < weekEndOffset; i++) {
        const date1 = new Date(beginNow - (day - i) * oneDayTime).getDate()
        const nowDate = new Date()
        const today = this.currentMonth === (nowDate.getMonth() + 1) && date1 === nowDate.getDate() // 判断日期是不是当天
        arr.push({
          today,
          date: date1 < 10 ? '0' + date1 : date1 + ''
        })
      }
      this.currentWeek = arr
    },
    calcSchoolYearAndTerm () {
      const now = new Date()
      const month = now.getMonth() + 1
      const year = now.getFullYear()

      if (month >= 8) {
        this.schoolYear = year + '-' + (year + 1)
        this.schoolTerm = 1
      } else {
        this.schoolYear = (year - 1) + '-' + (year)
        this.schoolTerm = 2
      }
    },
    // 随机浅色
    randomColor () {
      const r = Math.floor(Math.random() * (256 - 100) + 100)
      const g = Math.floor(Math.random() * (256 - 100) + 100)
      const b = Math.floor(Math.random() * (256 - 100) + 100)
      return 'rgb(' + r + ',' + g + ',' + b + ',' + 0.9 + ')'
    }
  }
}
</script>

<style scoped lang="less">
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    .headerBtn{
      width: 100%;
      background: #26a2ff;
      color: #fff;
      font-size: 0.9rem;
      border-radius: 0;
      img {
        width:1.3rem;
        vertical-align: sub
      }
    }
  }
  th.today {
    background: #e86150;
    border-radius: 8px;
  }
  .table_header{
    position: fixed;
    top: 40px;
    width:100%;
    border-collapse: collapse;
    padding: 0;
    table-layout: fixed;
    background: #26a2ff;
    tr {
      color:#fff;
    }
    p {
      font-size: .9rem;
    }
  }
  .table_body {
    margin-top: 80px;
    padding: 0;
    table-layout: fixed;
    background: url("/img/tablebg.jpg") center center no-repeat;
    background-size:100% 100%;
    td {
      font-size:10px;
      padding:3px;
      color: #fafafa;
      font-weight: bold;
      font-family: "Microsoft YaHei UI Light"
      /*-ms-word-wrap: break-word;*/
      /*word-wrap: break-word;*/
    }
    tr td:first-child{
      /* background:#FAFAFA!important; */
      font-weight: bold;
      font-size: 1rem;
      width:15px;
      color: #333;
    }
  }
</style>
