<template>
  <div id="bookDetails">
    <div class="container">
      <div class="bookInfo">
        <div class="firstTitle">{{bookInfo.title}}</div>
        <p><span>作者：</span>{{bookInfo.authors}}</p>
        <p><span>标准号：</span>{{bookInfo.isn}}</p>
        <p><span>分类号：</span>{{bookInfo.classNo1}}</p>
        <p><span>主题词：</span>{{bookInfo.subjectTerm}}</p>
        <p><span>出版社：</span>{{bookInfo.publisher}} - {{bookInfo.pubDate}}</p>
      </div>
      <p class="title">馆内流通信息</p>
      <div class="detailsList">
        <div v-for="(item, index) in bookDetail" :key="index" class="detailsContent">
          <div class="infoNumber">
            <p>{{index + 1}}</p>
          </div>
          <div class="infoContent">
            <p><span>条形码：</span>{{item.bookBarcode}}</p>
            <p><span>索书号：</span>{{item.bookSearchNo}}</p>
            <p><span>登录号：</span>{{item.accessNo}}</p>
            <p><span>馆藏部门：</span>{{item.departmentName}}</p>
            <p><span>图书状态：</span>{{judgeCirculStatus(item.circulStatus)}}</p>
            <!--<p v-show="item.dueTime"><span>应还日期：</span>{{item.dueTime}}</p>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bookDetail } from '@/api/educational'
export default {
  name: 'bookDetails',
  head () {
    return {
      title: '图书详情'
    }
  },
  data () {
    return {
      bookInfo: {},
      bookDetail: []
    }
  },
  created () {
    this.bookInfo = this.$route.query.bookInfo
  },
  mounted () {
    bookDetail(this.bookInfo.recCtrlId).then(resp => {
      this.bookDetail = resp.data
    })
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.container {
  width: 90%;
  min-height: 200px;
  margin: 0.5rem auto;
  padding: .5rem;
  background: #fff;
  border-radius: 5px;
  .bookInfo {
    background: #66cccc;
    border-radius: 6px;
    padding: 0.6rem 1rem;
    color: #fff;
    .firstTitle {
      font-size: 1.1rem;
      font-weight: bold;
      text-align: left;
    }
    p {
      text-align: left;
      font-size: 0.9rem;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      line-height: 1.5;
      span{
        width: 60px;
        display: inline-block;
      }
    }
  }
  .title{
    margin: 0.8rem 0 0.5rem 0;
    padding: .2rem;
    background: #26a2ff;
    border-radius: 4px;
    font-size: .9rem;
    /*text-align: left;*/
    color: #fff;
  }
  .detailsList{
    margin-top: .5rem;
    overflow: hidden;
    .detailsContent {
      background: #fff;
      padding: .5rem;
      border-bottom: 1px solid #ccc;
      color: #666;
      display: -webkit-flex;
      display: flex;
      .infoNumber{
        width: 15%;
        position: relative;
        p{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-60%, -50%);
          color: #fff;
          width: 1.5rem;
          height: 1.5rem;
          line-height: 1.5rem;
          background: #26a2ff;
          border-radius: 50%;
          font-size: .9rem;
        }
      }
      .infoContent {
        width: 85%;
        p {
          text-align: left;
          font-size: 0.9rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          line-height: 1.5;
          span{
            width: 70px;
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
