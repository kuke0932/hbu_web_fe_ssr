<template>
  <div id="score">
    <div class="header">
      <mt-button class="headerBtn" slot="right" @click.native="showTermPopup">
        【{{ !(schoolYear && schoolTerm) ? '请选择学期' : (schoolYear + '-' + '第' + schoolTerm + '学期') }}】
        <img src="../../assets/icon/down.svg" style=" width:1.3rem;vertical-align: sub" alt="">
      </mt-button>
    </div>
    <div>
      <mt-popup v-model="popupVisible" position="bottom" style="width: 100%;">
        <div class="confirm_cancel">
          <span  @click="cancel">取消</span>
          <span @click="confirm">确定</span>
        </div>
        <mt-picker style="clear: both"  :slots="schoolYearTerm" @change="onValuesChange" value-key="cname"></mt-picker>
      </mt-popup>
    </div>
    <div class="body">
      <div class="title">
        <span>课程</span>
        <span>学分</span>
        <span>绩点</span>
        <span>成绩</span>
        <span>重修</span>
      </div>
      <p v-if="courseScoreList.length === 0" style="position: fixed;padding: 0.5rem;text-align: center;width: 100%;">- 暂无成绩数据 -</p>
      <ul class="content">
        <li class="list" v-for="(score,index) in courseScoreList" :key="index">
          <span>{{score.courseName}}</span>
          <span>{{score.credit}}</span>
          <span>{{score.jd}}</span>
          <span>{{score.score}}</span>
          <!--<span>{{score.resitScore || '-' }}</span>-->
          <span>{{score.retakeScore || '-'}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { listCourseScore } from '@/api/educational'
export default {
  name: 'score',
  head () {
    return {
      title: '成绩查询'
    }
  },
  data () {
    return {
      courseScoreList: [],
      popupVisible: false,
      schoolYear: '',
      schoolTerm: '',
      schoolYearTerm:
        [
          {
            flex: 1,
            values: [
              {
                key: '2014-2015',
                cname: '2014-2015学年'
              },
              {
                key: '2015-2016',
                cname: '2015-2016学年'
              },
              {
                key: '2016-2017',
                cname: '2016-2017学年'
              },
              {
                key: '2017-2018',
                cname: '2017-2018学年'
              },
              {
                key: '2018-2019',
                cname: '2018-2019学年'
              },
              {
                key: '2019-2020',
                cname: '2019-2020学年'
              },
              {
                key: '2020-2021',
                cname: '2020-2021学年'
              }
            ],
            className: 'slot1',
            textAlign: 'center'
          },
          {
            flex: 1,
            values: [
              {
                key: 1,
                cname: '上学期'
              },
              {
                key: 2,
                cname: '下学期'
              }
            ],
            className: 'slot2',
            textAlign: 'center'
          }
        ],
      selectData: ''
    }
  },
  mounted () {
    this.calcSchoolYearAndTerm()
    const index1 = this.schoolYearTerm[0]
    const thisYear = this.schoolYear.substring(0, 4)
    index1.values = [{
      key: (thisYear - 3) + '-' + (thisYear - 2),
      cname: (thisYear - 3) + '-' + (thisYear - 2) + '学年'
    }, {
      key: (thisYear - 2) + '-' + (thisYear - 1),
      cname: (thisYear - 2) + '-' + (thisYear - 1) + '学年'
    }, {
      key: (thisYear - 1) + '-' + (thisYear),
      cname: (thisYear - 1) + '-' + (thisYear) + '学年'
    }, {
      key: this.schoolYear,
      cname: this.schoolYear + '学年'
    }]
    const index2 = this.schoolYearTerm[1]
    index1.defaultIndex = this.schoolYearTerm[0].values.findIndex(t => t.key === this.schoolYear)
    index2.defaultIndex = this.schoolYearTerm[1].values.findIndex(t => t.key === this.schoolTerm)
    this.$set(this.schoolYearTerm, 0, index1)
    this.$set(this.schoolYearTerm, 1, index2)
    this.fetchData()
  },
  methods: {
    fetchData () {
      listCourseScore(this.schoolYear, this.schoolTerm).then(resp => {
        this.courseScoreList = resp.data
      })
    },
    onValuesChange (picker, values) {
      this.selectData = values
    },
    showTermPopup () {
      this.popupVisible = true
    },
    cancel () {
      this.popupVisible = false
    },
    confirm () {
      this.schoolYear = this.selectData[0].key
      this.schoolTerm = this.selectData[1].key
      this.popupVisible = false
      this.fetchData()
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
  .title span {
    flex: 1;
  }
  .title span:first-child {
    flex: 3!important;
  }
  .title  {
    display: flex;
    width: calc(100% - 30px);
    position: fixed;
    top: 40px;
    height: 26px;
    background-color: #26a2ff;
    color: white;
    padding: 0 15px;
    z-index: 10;
  }
  .content span {
    flex: 1;
  }
  .content {
    margin-top: 68px;
  }
  .content .list {
    display: flex;
    align-items: center;
    margin: 5px 0;
    padding: 5px 15px;
    background: white;
    opacity: 0.8;
  }
  .content span:first-child {
    flex: 3!important;
  }
</style>
