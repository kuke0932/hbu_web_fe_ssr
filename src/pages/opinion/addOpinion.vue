<template>
  <div class="container register">
    <div class="registerForm">
      <mt-field label="内容" type="textarea" placeholder="请输入意见内容" v-model="content"></mt-field>
      <!--<div class="uploadRow contentRow" style="border-bottom: 2px solid  #d9d9d9;">-->
        <!--<div class="uploadLeft">内容</div>-->
        <!--<div class="uploadRight" style="text-align: left;">-->
          <!--<input style="border: none;" placeholder="请输入意见内容" type="text" v-model="content">-->
        <!--</div>-->
      <!--</div>-->
      <div class="uploadRow">
        <div class="uploadLeft">图片</div>
        <div class="uploadRight">
          <div class="imgs" v-for="(item, index) in imgIds" :key="index">
            <div class="maskImgs">
              <div class="enlarge" @click="showBig(index)">
                <img width="30px" height="30px" src="../../assets/icon/enlarge.svg" alt="">
              </div>
              <div class="delete" @click="deleteImg(index)">
                <img width="30px" height="30px" src="../../assets/icon/delete.svg" alt="">
              </div>
            </div>
            <img :src="item.url" alt="">
          </div>
          <input hidden type="file" name="file" id="file" class="inputfile"
                 accept="image/png, image/jpeg, image/gif, image/jpg"/>
          <label v-if="imgCounts < 6" for="file" class='btnUpload'><span>+</span><br/>点此上传</label>
        </div>
      </div>
    </div>
    <div class="bigImg" @click="hideBigImg" v-if="showBigImg"></div>
    <div class="swiperDiv" v-if="showBigImg" >
      <swiper :options="swiperOption" ref="imgOverview" style="height: 100%;" >
        <swiper-slide v-for="(img, index) in imgIds" :key="index">
          <div class="swiper-zoom-container" >
            <img class="img"  :src="img.url">
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="buttons">
      <mt-button style="width: 100%;" type="primary" @click="saves">保存</mt-button>
    </div>
  </div>
</template>

<script>
import { save } from '@/api/opinion'
import { MessageBox } from 'mint-ui'

export default {
  name: '',
  head () {
    return {
      title: '添加意见'
    }
  },
  data () {
    return {
      showBigImg: false,
      imgCounts: '',
      imgId: '',
      srcUrl: '',
      content: null,
      imgIds: [{
        id: 1,
        url: '/img/1.jpg'
      }, {
        id: 2,
        url: '/img/1.jpg'
      }, {
        id: 1,
        url: '/img/1.jpg'
      }, {
        id: 2,
        url: '/img/1.jpg'
      }, {
        id: 1,
        url: '/img/1.jpg'
      }],
      pageNum: 1,
      pageSize: 5,
      swiperOption: {
        width: 0,
        zoom: true,
        initialSlide: 0
      }
    }
  },
  watch: {
    imgIds () {
      this.imgCounts = this.imgIds.length
    }
  },
  mounted () {
    this.imgCounts = this.imgIds.length
    this.swiperOption.width = window.innerWidth
  },
  methods: {
    saves () {
      if (this.content === '' || this.content === null) {
        MessageBox('提示', '请输入意见内容')
        return
      }
      save(
        this.content,
        // this.imgIds
        null
      ).then(() => {
        // 跳转页面
        this.$router.push({ path: '/opinion' })
      })
    },
    showBig (index) {
      this.showBigImg = true
      this.swiperOption.initialSlide = index
    },
    hideBigImg () {
      this.showBigImg = false
    },
    deleteImg (index) {
      MessageBox.confirm('确定要删除吗?').then(action => {
        this.imgIds.splice(index, 1)
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .bigImg{
    width: 100%;
    height: 100%;
    z-index: 101;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0,0,0,.7);
    align-items: center;
  }
  .swiperDiv{
    position: absolute;
    left: 0;
    top: 20%;
    z-index: 102;
  }
  .bigImg>img{
    width: 100%;
    height: auto;
    align-items: center;
    opacity: 1;
  }
  .bigImg>.delete{
    padding: 10px;
    color: #ffffff;
    position: absolute;
    right: 0;
    top: 0;
  }
  .uploadRow{
    width: 100%;
    background: #ffffff;
    overflow: hidden;
    border-bottom: 1px solid #d9d9d9;
  }
  .uploadLeft{
    width: 15%;
    float: left;
    color: #2c3e50;
  }
  .uploadRight{
    width: 84%;
    float: left;
    height: auto;
    padding-top: 0.5rem;
    overflow: hidden;
    background: #ffffff;
    box-sizing: inherit;
  }
  .uploadRight .imgs{
    margin-bottom: 0.5rem;
    width: 98px;
    height: 98px;
    margin-right: 5px;
    border: 1px solid #aaa;
    float: left;
    position: relative;
  }
  .uploadRight .imgs > img {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    width: 98px;
    height: 98px;
  }
  .uploadRight .imgs .maskImgs{
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 101;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
  }
  .uploadRight .imgs .maskImgs .enlarge{
    margin-top: 30%;
    display: inline-block;
  }
  .uploadRight .imgs .maskImgs .delete{
    display: inline-block;
  }
  .btnUpload{
    margin-bottom: 0.5rem;
    width: 98px;
    height: 68px;
    padding-top: 30px;
    line-height: 20px;
    text-align: center;
    margin-right: 1%;
    border: 1px solid #aaa;
    float: left;
  }
  .btnUpload span{
    font-size: 24px;
  }

  .contentRow{
    height: 2.5rem;
  }
  .contentRow input{
    width: 307px;
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 14px;
    color: #888888;
  }
  .mint-cell-value{
    width: 60%;
  }
  .must{
    color: #ff0000;
  }
  .buttons{
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0px;
    z-index: 100;
    height: 56px;
  }
  .buttons button{
    display: block;
    float: left;
    height: 56px;
    line-height: 56px;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
  }
  .mint-cell-label{
    font-size: 16px;
    color: inherit;
  }
  .contactsType{
    width: 100%;
  }
  .page-search {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }
  .picker-slot-wrapper{
    text-align: center;
  }
  .mint-search{
    height: 100%;
  }
</style>
<style>
  .mint-field .mint-cell-title{
    width: 44px;
  }
  .mint-cell-wrapper{
    background-image: none;
    border-bottom: 1px solid #d9d9d9;
  }
  .mint-cell:last-child{
    background: none;
  }
</style>
