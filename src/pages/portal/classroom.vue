<template>
    <div id="classroom">
      <div class="searchContent">
        <div class="cell1">
          <mt-cell v-model="xqhJxlh" is-link @click.native="schoolVisible = true"></mt-cell>
        </div>
        <div class="cell2">
          <mt-cell v-model="syrq" is-link @click.native="openDatePicker"></mt-cell>
        </div>
        <div class="cell3">
          <mt-cell v-model="jc" is-link @click.native="JCVisible = true"></mt-cell>
        </div>
      </div>
      <mt-datetime-picker
        ref="datePicker"
        type="date"
        v-model="pickerValue"
        @confirm="handleConfirm">
      </mt-datetime-picker>
      <mt-popup
        style="width: 100%;"
        v-model="JCVisible"
        position="bottom">
        <div class="confirm_cancel">
          <span  @click="JCVisible = false">取消</span>
          <span @click="confirm">确定</span>
        </div>
        <mt-picker style="clear: both"  :slots="jcList" @change="chooseJC"></mt-picker>
      </mt-popup>
      <mt-popup v-model="schoolVisible" position="bottom" style="width: 100%;">
        <div class="confirm_cancel">
          <span @click="schoolVisible = false">取消</span>
          <span @click="confirm1">确定</span>
        </div>
        <mt-picker style="clear: both"  :slots="schoolList" @change="chooseSchool" value-key="value"></mt-picker>
      </mt-popup>
      <div v-if="completeParams" style="margin-top: 50px;text-align: center;color: #666;line-height: 50px; height: 50px;">
        - 请选择查询条件进行搜索 -
      </div>
      <div v-else class="page-loadmore-wrapper" ref="wrapper" :style="{ height: (wrapperHeight) + 'px' }">
        <mt-loadmore :top-method="loadTop"
                     @top-status-change="handleTopChange"
                     @translate-change="translateChange"
                     ref="loadmore"
                     :style="{ minHeight: (wrapperHeight) + 'px' }">

          <ul class="page-loadmore-list roomList"
              v-infinite-scroll="loadMore"
              :infinite-scroll-immediate-check="true"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="10">
            <li v-for="(item, index) in classroomList" class="page-loadmore-listitem roomItem" :key="index">
              <div class="jslx">{{item.jslxsm}}</div>
              <div class="jsInfo">
                <div ><img src="../../assets/icon/location.svg" alt="">教室号 {{item.jsh}}</div>
                <div ><img src="../../assets/icon/seat.svg" alt="">座位数 {{item.zws}}</div>
                <div v-if="yhlx === '3'"><img src="../../assets/icon/seat.svg" alt="">考试座位 {{item.kszws || ' - '}}</div>
              </div>
            </li>
          </ul>
          <div slot="top" class="mint-loadmore-top">
            <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
            <!--<span v-show="topStatus === 'loading'">-->
              <!--<mt-spinner type="snake"></mt-spinner>-->
            <!--</span>-->
          </div>

          <div slot="bottom" class="mint-loadmore-bottom" style="margin-bottom: 0!important;">
            <span v-show="noMoreData">无更多数据</span>
            <div v-show="loading" class="page-infinite-loading">
              <mt-spinner type="fading-circle"></mt-spinner>
              加载中...
            </div>
          </div>
        </mt-loadmore>
      </div>
      <div class="helpBtn" id="moveDiv" @click="openInputJSH" v-draggable>
        <img src="../../assets/icon/classroomNo.svg" alt="">
      </div>
      <mt-popup
        class="popupInputJSH"
        v-model="showInputJSH"
        position="middle">
        <div>
          <mt-field class="input" placeholder=" 输入教室编号" v-model.trim="inputContent">
            <mt-button class="btn" type="primary" size="small" @click.native="beginSearch">开始搜索</mt-button>
          </mt-field>
        </div>
      </mt-popup>
    </div>
</template>

<script>
import { listAllBuildingClassroom, listUnUsedBuildingClassroom } from '@/api/educational'
import { Toast } from 'mint-ui'
// 节流函数
// const delay = (() => {
//   let timer = 0
//   return function (callback, ms) {
//     clearTimeout(timer)
//     timer = setTimeout(callback, ms)
//   }
// })()
export default {
  name: 'classroom',
  head () {
    return {
      title: '空闲教室查询'
    }
  },
  data () {
    return {
      completeParams: false,
      noMoreData: false,
      wrapperHeight: 0,
      schoolVisible: false,
      className: '',
      pageNum: 1,
      pageSize: 10,
      pickerValue: new Date(),
      JCVisible: false,
      showInputJSH: false,
      inputContent: '',
      xqhJxlh: '',
      xqh: '',
      jxlh: '',
      jc: '选择节次',
      fromJc: '',
      toJc: '',
      syrq: '',
      classroom: '',
      jcList: [
        {
          flex: 1,
          values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          className: 'slot1',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot2'
        },
        {
          flex: 1,
          values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          className: 'slot3',
          textAlign: 'center'
        }
      ],
      totalData: '',
      schoolList: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot2'
        },
        {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        }
      ],
      selectJC: '',
      selectSchool: '',
      classroomList: [],
      translate: 0,
      topStatus: '',
      loading: false
    }
  },
  created () {
  },
  mounted () {
    this.initSchoolList()
    this.wrapperHeight = document.documentElement.clientHeight - 50
  },
  beforeUpdate () {
    this.completeParams = !(this.xqh && this.jxlh && this.fromJc && this.toJc && this.syrq)
  },
  watch: {
    // classroom () {
    //   delay(() => {
    //     this.reloadData()
    //   }, 1000)
    // },
    translate () {
      this.$nextTick(() => {
        this.resetTransform()
      })
    }
  },
  methods: {
    openInputJSH () {
      this.showInputJSH = true
      this.classroom = ''
      this.inputContent = ''
    },
    beginSearch () {
      if (this.inputContent && this.jc === '选择节次') {
        this.showInputJSH = false
        Toast({
          message: '请选择节次',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      this.classroom = this.inputContent
      this.reloadData()
      this.classroom = ''
      this.inputContent = ''
      this.showInputJSH = false
    },
    fetchData (xqh, jxlh, fromJc, toJc, syrq, classroom, pageNum, pageSize) {
      if (!xqh || !jxlh || !fromJc || !toJc || !syrq) {
        return Promise.reject(new Error('null'))
      } else {
        return listUnUsedBuildingClassroom(xqh, jxlh, fromJc, toJc, syrq, classroom, pageNum, pageSize)
      }
    },
    initSchoolList () {
      listAllBuildingClassroom().then(resp => {
        const arr = []
        this.totalData = resp.data
        this.schoolList[0].values = Object.keys(this.totalData).map(t => ({ value: t.split('|')[1], key: t }))
        this.totalData[this.schoolList[0].values[0].key].forEach(e => {
          arr.push({ value: e.split('|')[1], key: e })
        })
        this.$set(this.schoolList[2], 'values', arr)
        this.xqh = this.schoolList[0].values[0].key
        this.jxlh = this.schoolList[2].values[0].key
        this.xqhJxlh = this.xqh.substring(2) + ' - ' + this.jxlh.substring(2)
        this.handleConfirm(new Date())
      })
    },
    // 日期选择
    openDatePicker () {
      this.$refs.datePicker.open()
    },
    handleConfirm (e) {
      const year = e.getFullYear()
      const month = e.getMonth() + 1
      const date = e.getDate()
      this.syrq = year + '-' + this.isTen(month) + '-' + this.isTen(date)
      this.reloadData()
    },
    // 节次
    chooseJC (picker, values) {
      this.selectJC = values
    },
    confirm () {
      this.JCVisible = false
      this.fromJc = this.selectJC[0]
      this.toJc = this.selectJC[1]
      this.jc = this.fromJc + '  -  ' + this.toJc
      this.reloadData()
    },
    // 校区楼号
    chooseSchool (picker, values) {
      const currentValues = this.totalData[values[0] && values[0].key]
      const arr = []
      if (!currentValues) return
      currentValues.forEach(e => {
        arr.push({ value: e.split('|')[1], key: e })
      })
      picker.setSlotValues(1, arr) // 为什么是1
      this.selectSchool = values
    },
    confirm1 () {
      this.schoolVisible = false
      this.xqh = this.selectSchool[0].key
      this.jxlh = this.selectSchool[1].key
      this.xqhJxlh = this.xqh.split('|')[1] + ' - ' + this.jxlh.split('|')[1]
      this.reloadData()
    },
    isTen (num) {
      return num < 10 ? '0' + num : num
    },
    translateChange (translate) {
      this.translate = translate
    },
    loadMore () {
      if (!this.noMoreData) {
        this.loading = true
        return this.fetchData(
          this.xqh.split('|')[0],
          this.jxlh.split('|')[0],
          this.fromJc,
          this.toJc,
          this.syrq,
          this.classroom,
          this.pageNum,
          this.pageSize).then(resp => {
          this.classroomList = this.classroomList.concat(resp.data)
          if (resp.data.length < this.pageSize) {
            this.noMoreData = true
          }
          this.loading = false
          this.pageNum++
          return resp
        }).catch((e) => {
          this.loading = false
          console.log(e)
        })
      } else {
        return Promise.reject(new Error('no data'))
      }
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    loadTop () {
      this.reloadData().then(() => {
        this.$refs.loadmore.onTopLoaded()
      }).catch(e => {
        console.log(e)
        this.$refs.loadmore.onTopLoaded()
      })
    },
    resetTransform () {
      // eslint-disable-next-line
      // if (this.translate == '0' || this.translate == '50' || this.translate == '-50') {
      const loadmore = document.querySelector('.is-dropped')
      if (loadmore && loadmore.style.transform) {
        console.log(loadmore.style.transform)
        loadmore.style.transform = ''
      }
      // }
    },
    reloadData () {
      this.noMoreData = false
      this.pageNum = 1
      this.classroomList = []
      return this.loadMore()
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
  .popupInputJSH {
    width: 85%;
    border-radius: 5px;
    padding: 2rem 0.5rem;
    div {
      .input {
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .btn {
        margin-left: 1.5rem;
      }
    }
  }
  .searchContent{
    width: 100%;
    position: fixed;
    top: 0;
    .cell1 {
      width: 33%;
      position: absolute;
      left: 0;
      border-right: 1px solid whitesmoke;
      box-sizing: border-box;
    }
    .cell2 {
      width: 34%;
      position: absolute;
      right: 33%;
      border-right: 1px solid whitesmoke;
      box-sizing: border-box;
    }
    .cell3 {
      width: 33%;
      position: absolute;
      right: 0;
    }
  }
  .roomList{
    list-style: none;
    .roomItem{
      margin: 8px 20px;
      border-radius: 6px;
      padding: 0.6rem 0;
      background: #fff;
      .jslx{
        text-align: left;
        border-left: 3px solid #26a2ff;
        color: #26a2ff;
        margin: 0.2rem 0;
        padding-left: 0.3rem;
      }
      .jsInfo {
        padding: 0.5rem 0;
        text-align: left;
        display: -webkit-flex;
        display: flex;
        div {
          width: 50%;
          font-size: .9rem;
          img {
            vertical-align: sub;
            width: 1rem;
            margin-right: 0.3rem;
          }
        }
      }
    }
  }
  .helpBtn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    text-align: center;
    background: #26a2ff;
    img {
      position: absolute;
      top: 46%;
      left: 50%;
      transform: translate(-50%, -50%)
    }
  }
  // 上拉下拉相关
  .loading-background, .mint-loadmore-top span {
    -webkit-transition: .2s linear;
    transition: .2s linear
  }
  .mint-loadmore-top span {
    display: inline-block;
    vertical-align: middle
  }
  .mint-loadmore-top span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
  }
  .page-loadmore .mint-spinner {
    display: inline-block;
    vertical-align: middle
  }
  .page-loadmore-desc {
    text-align: center;
    color: #666;
    padding-bottom: 5px
  }
  /*.page-loadmore-desc:last-of-type,
  .page-loadmore-listitem {
    border-bottom: 1px solid #eee
  }
  .page-loadmore-listitem {
    height: 50px;
    line-height: 50px;
    text-align: center
  }
  .page-loadmore-listitem:first-child {
    border-top: 1px solid #eee
  }*/
  .page-loadmore-wrapper {
    margin-top: 50px;
    overflow: auto;
    -webkit-overflow-scrolling: touch
  }
  .mint-loadmore-bottom span {
    display: inline-block;
    -webkit-transition: .2s linear;
    transition: .2s linear;
    vertical-align: middle
  }
  .mint-loadmore-bottom span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
  }
</style>
