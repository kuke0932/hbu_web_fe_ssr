<template>
  <div class="container">
    <!--搜索begin-->
    <div class="page-search">
      <mt-search v-model="value" placeholder="请输入意见内容" :result="filterResult" :show="true">
        <div style="margin-top: 10px;">
          <mt-loadmore :top-method="loadTop"
                       @top-status-change="handleTopChange"
                       @translate-change="translateChange"
                       ref="loadmore"
                       :style="{ minHeight: (wrapperHeight) + 'px' }">
            <ul class="page-loadmore-list"
                v-infinite-scroll="loadMore"
                :infinite-scroll-immediate-check="true"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10">
              <li v-for="(item, index) in filterResult" class="page-loadmore-listitem divBar" :key="index" @click="goDetail(item.id)">
                <div class="divRow">
                  <div><span>{{ item.content }}</span></div>
                </div>
                <div  class="divRow">
                  <div class="divLeft">
                    <div><span>{{ item.createTime }}</span></div>
                  </div>
                  <div style="float: right;"><span>{{ item.revertType === 0 ? '没回复':'已回复' }}</span></div>
                </div>
              </li>
            </ul>
            <div slot="top" class="mint-loadmore-top">
              <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
            </div>

            <div slot="bottom" class="mint-loadmore-bottom" style="margin-bottom: 0!important;">
              <span v-show="noMoreData">无更多数据</span>
              <p v-show="loading" class="page-infinite-loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                加载中...
              </p>
            </div>
          </mt-loadmore>
        </div>
      </mt-search>
    </div>
    <!--搜索end-->

    <div id="target" class="btnAddOpinion" @click="goAddOpinion" v-draggable><img src="../../assets/icon/add.svg" alt=""></div>
  </div>
</template>

<script>
import { list } from '@/api/opinion'

export default {
  name: 'opinion',
  head () {
    return {
      title: '意见列表'
    }
  },
  data () {
    return {
      noMoreData: false,
      wrapperHeight: 0,
      opinionId: null,
      opinionList: [],
      value: '',
      pageNum: 1,
      pageSize: 5,
      translate: 0,
      topStatus: '',
      loading: false
    }
  },
  watch: {
    translate () {
      this.$nextTick(() => {
        this.resetTransform()
      })
    }
  },
  computed: {
    filterResult () {
      return this.opinionList.filter(value => new RegExp(this.value, 'i').test(value.content))
    },
    opinionTotal () {
      return this.filterResult.length
    }
  },
  mounted () {
    this.wrapperHeight = document.documentElement.clientHeight - 50
    this.reloadData()
  },
  methods: {
    fetchData (content, pageNum, pageSize) {
      return list(
        content,
        pageNum,
        pageSize
      )
    },
    goDetail (id) {
      this.opinionId = id
      // 跳转页面并把id传过去
      this.$router.push({ path: '/opinion/opinionDetail', query: { opinionId: this.opinionId } })
    },
    goAddOpinion () {
      this.$router.push({ path: '/opinion/addOpinion' })
    },
    translateChange (translate) {
      this.translate = translate
    },
    loadMore () {
      if (!this.noMoreData) {
        this.loading = true
        return this.fetchData(
          null,
          this.pageNum,
          this.pageSize
        ).then(resp => {
          document.querySelector('.btnAddOpinion').style.display = 'block'
          this.opinionList = this.opinionList.concat(resp.data.rows)
          if (resp.data.rows.length < this.pageSize) {
            this.noMoreData = true
          }
          this.loading = false
          this.pageNum++
          return resp
        }).catch((e) => {
          this.loading = false
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
        this.$refs.loadmore.onTopLoaded()
      })
    },
    resetTransform () {
      const loadmore = document.querySelector('.is-dropped')
      if (loadmore && loadmore.style.transform) {
        loadmore.style.transform = ''
      }
    },
    reloadData () {
      this.noMoreData = false
      this.pageNum = 1
      this.opinionList = []
      return this.loadMore()
    }
  }
}
</script>

<style scoped>
  .divBar{
    width: 96%;
    padding: 0.5rem 2%;
    background: #ffffff;
    margin-bottom: 5px;
    overflow: hidden;
  }
  .divBarSearch{
    margin-bottom: 0;
    border-bottom: 1px dashed #eeeeee;
  }
  .divBar>div.divRow{
    width: 100%;
    overflow: hidden;
    padding: 0.2rem 0px;
  }
  .divBar>div.divRow>div{
    width: auto;
    height: 2rem;
    line-height: 2rem;
    float: left;
    text-align: left;
    font-size: 16px;
  }
  .divBar>div.divRow>div.divLeft{
    margin-right: 10px;
  }
  .divBar>div.divRow>div.divLeft>img{
    margin-left: 10px;
    margin-top: 0.2rem;
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    float: left;
  }
  .divBar>div.divRow>div.divLeft>div{
    float: left;
  }
  .page-search {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
  }
  .btnAddOpinion{
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    z-index: 2000;
    width:50px;
    height:50px;
    border-radius:50%;
    background-color:#26a2ff;
    color: #fff;
    line-height:55px;
    text-align:center;
    font-size: 36px;
    display: block;
  }
</style>
