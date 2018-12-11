<template>
  <div id="pc">
    <div class="div1000">
      <div class="head">
        河北大学统一认证平台用户安全中心
      </div>

      <div class="tab">
        <div class="tabTitle">
          <ul>
            <li v-bind:class="{curr: currentTab === 0}" @click="goResetPassword()">找回密码</li>
            <li v-bind:class="{curr: currentTab === 1}"  @click="goModifyPassword">修改密码</li>
          </ul>
        </div>
        <nuxt-child/>
        <!--<iframe id="findPassword" src="findPassword.html" style="display: block;width: 100%;height: 598px;"></iframe>-->
        <!--<iframe id="resetPassword" src="../modifyPassword/index.html" style="display: none;width: 100%;height: 598px;"></iframe>-->
      </div>
    </div>

    <div class="twoDimensionCode">
      <img src="../static/img/pc/qrcode.png" width="150" height="150" alt="">
      <p>微信扫码关注<br />“河北大学微门户”</p>
    </div>
  </div>
</template>
<script>

export default {
  components: {
  },
  data () {
    return {
      currentTab: 0
    }
  },
  created () {
    const path = this.$route.path
    if (path === '/pc') {
      this.$router.push({ path: '/pc/resetPassword' })
    } else if (path === '/pc/resetPassword') {
      this.currentTab = 0
    } else if (path === '/pc/modifyPassword') {
      this.currentTab = 1
    } else {}
  },
  methods: {
    goResetPassword () {
      this.currentTab = 0
      this.$router.push({ path: '/pc/resetPassword' })
    },
    goModifyPassword () {
      this.currentTab = 1
      this.$router.push({ path: '/pc/modifyPassword' })
    }
  }
}
</script>
<style >
  .forms{
    width: 450px;
    margin: 100px auto 0;
  }
  *{
    margin: 0;
    padding: 0;
    border: 0;
    font-family: "Microsoft YaHei";
  }
  body {
    background-color: #fff;
  }
  ul,li{ list-style: none; }
  #pc{
    width: 100%;
    height: auto;
    position: relative;
  }
  .twoDimensionCode{
    width: 150px;
    height: 150px;
    border: 1px solid #5f6368;
    position: absolute;
    right: 1px;
    top: 149px;
  }
  .twoDimensionCode p{
    font-size: 14px;
  }

  .div1000{
    min-width: 1000px;
    max-width: 1400px;
    width: 100%;
    height: auto;
    margin: 0 auto;
  }
  /* 头部 */
  .head{
    width: 100%;
    height: 100px;
    line-height: 100px;
    background: #18479f;
    color: #ffffff;
    text-align: center;
    font-size: 34px;
  }

  /* 选项卡---选项 */
  .tabTitle{
    width: 100%;
    height: 46px;
    margin-top: 1px;
  }
  .tabTitle>ul>li{
    width: 50%;
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    text-align: center;
    float: left;
    color: #ff5d25;
    cursor: pointer;
  }
  .tabTitle>ul>li.curr{
    box-sizing: border-box;
    border-bottom: 3px solid #ff5d25;
  }
  /* 选项卡---内容 */
  .tabItem{
    width: 100%;
    height: 598px;
    border: 1px solid #ff5d25;
    box-sizing: border-box;
    overflow: hidden;
  }

  /*step1 */
  .steps{
    width: 885px;
    height: 50px;
    margin: 75px auto 0;
  }
  .steps>ul>li{
    float: left;
    color: #ffffff;
    font-size: 16px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .steps>ul>li.bgStep1{
    width: 270px;
    height: 50px;
    background: url("/img/pc/step1.png");
  }
  .steps>ul>li.bgStep2{
    width: 337px;
    height: 50px;
    background: url("/img/pc/step2.png");
  }
  .steps>ul>li.bgStep3{
    width: 278px;
    height: 50px;
    background: url("/img/pc/step3.png");
  }
  .steps>ul>li.bgStep1Selected{
    background: url("/img/pc/step1Selected.png");
  }
  .steps>ul>li.bgStep2Selected{
    background: url("/img/pc/step2Selected.png");
  }
  .steps>ul>li.bgStep3Selected{
    background: url("/img/pc/step3Selected.png");
  }

  .steps .bgStep1_1{
    width: 213px;
    height: 50px;
    background: url("/img/pc/step1_1.png");
  }
  .steps .bgStep2_2{
    width: 231px;
    height: 50px;
    background: url("/img/pc/step1_2.png");
  }
  .steps .bgStep3_3{
    width: 230px;
    height: 50px;
    background: url("/img/pc/step1_3.png");
  }
  .steps .bgStep4_4{
    width: 214px;
    height: 50px;
    background: url("/img/pc/step1_4.png");
  }
  .steps .bgStep1_1Selected{
    width: 213px;
    height: 50px;
    background: url("/img/pc/step1_1Selected.png");
  }
  .steps .bgStep2_2Selected{
    width: 231px;
    height: 50px;
    background: url("/img/pc/step1_2Selected.png");
  }
  .steps .bgStep3_3Selected{
    width: 230px;
    height: 50px;
    background: url("/img/pc/step1_3Selected.png");
  }
  .steps .bgStep4_4Selected{
    width: 214px;
    height: 50px;
    background: url("/img/pc/step1_4Selected.png");
  }

  .el-input__inner{
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;}
  .el-button--primary{
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    background: #5490ff;
    padding: 12px 70px;
  }
</style>
