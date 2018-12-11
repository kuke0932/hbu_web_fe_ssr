<template>
  <div class="container">
    <div class="registerForm">
      <mt-cell title="标题" v-model="content"></mt-cell>
      <mt-cell title="内容" v-model="content"></mt-cell>
      <div class="divRow">
        <div class="divRowLeft">图片</div>
        <div class="divRowRight">
          <img v-for="(item, index) in imgIds" :key="index" :src="item.url" alt="" @click="showBig(index)">
        </div>
      </div>
    </div>
    <div class="bigImg" v-if="showBigImg" @click="hideBigImg"></div>
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
      <mt-button style="width: 100%;" type="primary">联系他</mt-button>
    </div>
  </div>
</template>

<script>
// import { getById } from '@/api/opinion'

export default {
  name: '',
  head () {
    return {
      title: '商品详情'
    }
  },
  data () {
    return {
      showBigImg: false,
      srcUrl: '',
      productId: null,
      content: '11111111111',
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
      }, {
        id: 2,
        url: '/img/1.jpg'
      }],
      swiperOption: {
        width: 0,
        zoom: true,
        initialSlide: 0
      }
    }
  },
  mounted () {
    this.productId = this.$route.query.productId
    this.swiperOption.width = window.innerWidth
    /* getById(
      this.productId
    ).then(resp => {
      this.content = resp.data.content
    }) */
  },
  methods: {
    showBig (index) {
      this.swiperOption.initialSlide = index
      this.showBigImg = true
    },
    hideBigImg (e) {
      this.showBigImg = false
    }
  }
}
</script>
<style lang="less" scoped>
  .container{
    min-height: 100%;
  }
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
  .divReply{
    width: 100%;
    background: #ffffff;
    overflow: hidden;
    padding: 1rem -0px;
    color: #999;
  }
  .divReply .divReplyLeft{
    width: 27%;
    float: left;
  }
  .divReply .divReplyRight{
    width: 73%;
    height: auto;
    float: left;
    text-align: left;
    padding-left: 5px;
    box-sizing: border-box;
  }

  .divRow{
    width: 100%;
    height: auto;
    padding: 5px 0;
    overflow: hidden;
    background: #ffffff;
    border-bottom: 1px solid #d9d9d9;
  }
  .divRow .divRowLeft{
    width: 13%;
    padding-top: 5px;
    float: left;
    text-indent: 3px;
    /*font-weight: bold;*/
  }
  .divRow .divRowRight{
    width: 86%;
    float: right;
    padding: 5px;
    text-align: left;
    box-sizing: border-box;
  }
  .divRow .divRowRight>img{
    margin-bottom: 0.5rem;
    width: 98px;
    height: 98px;
    margin-right: 1%;
    border: 1px solid #aaa;
    float: left;
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
  }
</style>
<style>
  .mint-cell-title{
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
